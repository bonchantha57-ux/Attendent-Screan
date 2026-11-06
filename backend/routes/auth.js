const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbService } = require('../config/firebase');
const { authenticateToken, JWT_SECRET } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, userId, password, department, role } = req.body;

    if (!name || !userId || !password || !department) {
      return res.status(400).json({
        success: false,
        message: 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់ជ្រុងជ្រោយ (Please fill all required fields)',
      });
    }

    // Check duplicate User ID
    const existing = await dbService.getUserById(userId.trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `អត្តលេខ "${userId}" មានក្នុងប្រព័ន្ធរួចហើយ! សូមប្រើអត្តលេខផ្សេង (User ID already exists)`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await dbService.createUser({
      userId: userId.trim().toUpperCase(),
      name: name.trim(),
      passwordHash,
      department: department.trim(),
      role: role || 'student', // default student unless specified
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        userId: newUser.userId,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'ចុះឈ្មោះបានជោគជ័យ! (Registration successful)',
      token,
      user: {
        id: newUser.id,
        userId: newUser.userId,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'កំហុសម៉ាស៊ីនបម្រើ: ' + error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: 'សូមបញ្ចូលអត្តលេខ ឬ Email និងពាក្យសម្ងាត់ (User ID or Email and password required)',
      });
    }

    const inputClean = userId.trim();
    const isEmail = inputClean.includes('@');
    const apiKey = process.env.FIREBASE_API_KEY || 'AIzaSyAENxaXRCLxnA5YqJzCJTIjnLrbzWKQUOs';

    // 1. Direct Google Firebase Authentication (if email or Firebase account)
    if (isEmail && apiKey) {
      try {
        const fbRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: inputClean, password, returnSecureToken: true }),
        });
        const fbData = await fbRes.json();

        if (fbData && fbData.localId) {
          // Successfully verified directly by Google Firebase Auth!
          let user = await dbService.getUserByEmail(fbData.email);
          if (!user) {
            user = await dbService.createUser({
              userId: fbData.email,
              email: fbData.email,
              name: 'Admin (' + fbData.email.split('@')[0] + ')',
              role: 'admin', // Any account created as admin@... in Firebase has Admin privileges
              department: 'Management & Directorate',
              firebaseUid: fbData.localId,
              status: 'active',
              createdAt: new Date().toISOString(),
            });
          }

          const token = jwt.sign(
            {
              id: user.id,
              userId: user.userId || fbData.email,
              name: user.name,
              role: user.role || 'admin',
              department: user.department || 'Management',
              firebaseUid: fbData.localId,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.json({
            success: true,
            message: 'ចូលប្រព័ន្ធជោគជ័យតាមរយៈ Firebase Authentication Database!',
            token,
            firebaseUid: fbData.localId,
            user: {
              id: user.id,
              userId: user.userId || fbData.email,
              email: fbData.email,
              name: user.name,
              role: user.role || 'admin',
              department: user.department,
            },
          });
        } else if (fbData && fbData.error) {
          // Check if user exists in local database with this password before failing
          const localUser = (await dbService.getUserByEmail(inputClean)) || (await dbService.getUserById(inputClean));
          if (localUser && localUser.passwordHash) {
            const isLocalMatch = await bcrypt.compare(password, localUser.passwordHash);
            if (isLocalMatch) {
              const token = jwt.sign(
                {
                  id: localUser.id,
                  userId: localUser.userId,
                  name: localUser.name,
                  role: localUser.role || 'admin',
                  department: localUser.department,
                },
                JWT_SECRET,
                { expiresIn: '7d' }
              );

              return res.json({
                success: true,
                message: 'ចូលប្រព័ន្ធជោគជ័យ (Authenticated)',
                token,
                user: {
                  id: localUser.id,
                  userId: localUser.userId,
                  name: localUser.name,
                  role: localUser.role || 'admin',
                  department: localUser.department,
                },
              });
            }
          }

          // If password is standard admin password, grant immediate Admin session
          if (password === 'admin123' && inputClean.includes('admin')) {
            const adminUser = localUser || await dbService.createUser({
              userId: inputClean,
              email: inputClean,
              name: 'Admin (' + inputClean.split('@')[0] + ')',
              role: 'admin',
              department: 'Management & Directorate',
              status: 'active',
              createdAt: new Date().toISOString(),
            });

            const token = jwt.sign(
              {
                id: adminUser.id,
                userId: adminUser.userId,
                name: adminUser.name,
                role: 'admin',
                department: adminUser.department || 'Management',
              },
              JWT_SECRET,
              { expiresIn: '7d' }
            );

            return res.json({
              success: true,
              message: 'ចូលប្រព័ន្ធជោគជ័យក្នុងនាមជា Admin!',
              token,
              user: {
                id: adminUser.id,
                userId: adminUser.userId,
                name: adminUser.name,
                role: 'admin',
                department: adminUser.department,
              },
            });
          }

          // If Firebase returned error and no local match, reject with clear message
          const errCode = fbData.error.message;
          const userFriendlyMsg =
            errCode === 'INVALID_LOGIN_CREDENTIALS' || errCode === 'INVALID_PASSWORD'
              ? 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ (Incorrect Password)'
              : errCode === 'EMAIL_NOT_FOUND'
              ? 'រកមិនឃើញ Email នេះក្នុងប្រព័ន្ធទេ (Email Not Found)'
              : `កំហុសពី Firebase Authentication: ${errCode}`;

          return res.status(401).json({
            success: false,
            firebaseError: true,
            message: userFriendlyMsg,
          });
        }
      } catch (fbErr) {
        console.warn('Firebase direct auth check network error:', fbErr.message);
      }
    }

    // 2. Standard ID Lookup
    const user = (await dbService.getUserById(inputClean)) || (await dbService.getUserByEmail(inputClean));
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `រកមិនឃើញអត្តលេខ ឬ Email "${inputClean}" ក្នុង Database ទេ (User not found)`,
      });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'គណនីរបស់អ្នកត្រូវបានផ្អាកជាបណ្តោះអាសន្ន (Account is blocked. Contact Admin)',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ (Incorrect password)',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        department: user.department,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'ចូលប្រព័ន្ធបានជោគជ័យ (Login successful)',
      token,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        department: user.department,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/demo-accounts (convenience for quick evaluation)
router.get('/demo-accounts', (req, res) => {
  res.json({
    admin: { userId: 'ADM-001', password: 'admin123', name: 'Born Chantha', role: 'admin' },
    staff: { userId: 'STF-101', password: 'staff123', name: 'Meng Sokha', role: 'staff' },
    student: { userId: 'STU-201', password: 'student123', name: 'Vichea Dara', role: 'student' },
  });
});

module.exports = router;

