const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { dbService } = require('../config/firebase');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// All routes here require Admin role
router.use(authenticateToken, requireRole(['admin']));

// GET /api/users - List users with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, role, department } = req.query;
    let users = await dbService.getAllUsers();

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.userId.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q))
      );
    }

    if (role && role !== 'all') {
      users = users.filter((u) => u.role === role);
    }

    if (department && department !== 'all') {
      users = users.filter((u) => u.department === department);
    }

    // Sanitize passwordHash out of responses
    const sanitized = users.map((u) => {
      const { passwordHash, ...rest } = u;
      return rest;
    });

    res.json({ success: true, count: sanitized.length, users: sanitized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/users - Create new user from Admin Panel
router.post('/', async (req, res) => {
  try {
    const { userId, name, password, role, department } = req.body;

    if (!userId || !name || !password || !department) {
      return res.status(400).json({
        success: false,
        message: 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់ (All fields required)',
      });
    }

    const existing = await dbService.getUserById(userId.trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `អត្តលេខ ${userId} មានរួចហើយ (User ID already exists)`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await dbService.createUser({
      userId: userId.trim().toUpperCase(),
      name: name.trim(),
      passwordHash,
      role: role || 'student',
      department: department.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    const { passwordHash: _, ...userSafe } = newUser;
    res.status(201).json({
      success: true,
      message: 'បង្កើតគណនីថ្មីបានជោគជ័យ (User created successfully)',
      user: userSafe,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/users/:id - Edit user details or reset password
router.put('/:id', async (req, res) => {
  try {
    const { name, department, role, password, status } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (department) updates.department = department.trim();
    if (role) updates.role = role;
    if (status) updates.status = status; // 'active' | 'blocked'

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(password.trim(), salt);
    }

    const updated = await dbService.updateUser(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { passwordHash: _, ...safe } = updated;
    res.json({
      success: true,
      message: 'កែប្រែព័ត៌មានអ្នកប្រើប្រាស់ជោគជ័យ (User updated successfully)',
      user: safe,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const success = await dbService.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'បានលុបគណនីជោគជ័យ (User deleted)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

