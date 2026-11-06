const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let admin = null;
let firestoreDb = null;
let realtimeDb = null;
let isLiveFirebase = false;

// Check if Firebase Admin SDK can be initialized
try {
  admin = require('firebase-admin');

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const databaseURL = process.env.FIREBASE_DATABASE_URL || `https://${projectId || 'test-ca6dd'}-default-rtdb.firebaseio.com`;

  const serviceAccountFile = path.join(__dirname, '../serviceAccountKey.json');

  if (fs.existsSync(serviceAccountFile)) {
    const serviceAccount = require(serviceAccountFile);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: databaseURL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
    });
    firestoreDb = admin.firestore();
    try {
      realtimeDb = admin.database();
    } catch (e) {}
    isLiveFirebase = true;
    console.log('✅ Connected to LIVE Google Firebase using serviceAccountKey.json');
  } else if (projectId && clientEmail && privateKey && !projectId.includes('your-firebase')) {
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: databaseURL || undefined,
    });

    firestoreDb = admin.firestore();
    if (databaseURL) {
      try {
        realtimeDb = admin.database();
      } catch (e) {}
    }
    isLiveFirebase = true;
    console.log('✅ Connected to LIVE Google Firebase Firestore & Realtime Database');
  } else {
    console.log(`ℹ️ Project ID set to: "${projectId}". Running in Local High-Fidelity Fallback Storage Mode.`);
    console.log('ℹ️ (Optional: drop serviceAccountKey.json into backend/ folder to activate full Firebase Admin SDK).');
  }
} catch (error) {
  console.warn('⚠️ Firebase init warning:', error.message);
  console.log('ℹ️ Using Local Storage Mode with instant read/write.');
}

// Fallback Local File Store
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const initialData = {
      users: [
        {
          id: 'u-adm-001',
          userId: 'ADM-001',
          name: 'Born Chantha (Admin)',
          passwordHash: bcrypt.hashSync('admin123', salt),
          role: 'admin',
          department: 'Management & IT Directorate',
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: 'u-stf-101',
          userId: 'STF-101',
          name: 'Meng Sokha (Instructor)',
          passwordHash: bcrypt.hashSync('staff123', salt),
          role: 'staff',
          department: 'Computer Science & Software',
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: 'u-stu-201',
          userId: 'STU-201',
          name: 'Vichea Dara (Student)',
          passwordHash: bcrypt.hashSync('student123', salt),
          role: 'student',
          department: 'Computer Science - Year 3',
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: 'u-stu-202',
          userId: 'STU-202',
          name: 'Chan Bopha (Student)',
          passwordHash: bcrypt.hashSync('student123', salt),
          role: 'student',
          department: 'Information Technology - Year 2',
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: 'u-stu-203',
          userId: 'STU-203',
          name: 'Rith Pisey (Student)',
          passwordHash: bcrypt.hashSync('student123', salt),
          role: 'student',
          department: 'Graphic Design - Year 1',
          createdAt: new Date().toISOString(),
          status: 'active'
        }
      ],
      attendance: [
        {
          id: 'att-seed-01',
          userId: 'STF-101',
          userName: 'Meng Sokha (Instructor)',
          role: 'staff',
          department: 'Computer Science & Software',
          date: new Date().toISOString().split('T')[0],
          checkIn: '07:55 AM',
          checkInTime: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          checkOut: null,
          checkOutTime: null,
          totalHours: null,
          status: 'working', // 'off_duty', 'working', 'checked_out', 'late', 'absent', 'permission'
          method: 'QR_SCAN',
          device: 'Browser Mobile Camera',
          distanceMeters: 45,
          overrideReason: null,
          overriddenBy: null
        },
        {
          id: 'att-seed-02',
          userId: 'STU-201',
          userName: 'Vichea Dara (Student)',
          role: 'student',
          department: 'Computer Science - Year 3',
          date: new Date().toISOString().split('T')[0],
          checkIn: '08:10 AM',
          checkInTime: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          checkOut: null,
          checkOutTime: null,
          totalHours: null,
          status: 'working',
          method: 'QR_SCAN',
          device: 'Chrome Mobile',
          distanceMeters: 62,
          overrideReason: null,
          overriddenBy: null
        }
      ],
      kioskQr: {
        lastToken: null,
        updatedAt: null
      }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

ensureDataFile();

function readLocalData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { users: [], attendance: [], kioskQr: {} };
  }
}

function writeLocalData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing store.json:', e);
  }
}

// Data Service layer uniting Firestore & Realtime DB or Fallback
const dbService = {
  isLiveFirebase: () => isLiveFirebase,

  // --- USERS ---
  async getAllUsers() {
    if (isLiveFirebase && firestoreDb) {
      const snap = await firestoreDb.collection('users').get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    const data = readLocalData();
    return data.users;
  },

  async getUserById(userId) {
    if (!userId) return null;
    const clean = userId.toLowerCase().trim();
    if (isLiveFirebase && firestoreDb) {
      const snap = await firestoreDb.collection('users').where('userId', '==', clean).limit(1).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };
      }
    }
    const data = readLocalData();
    return data.users.find((u) => u.userId.toLowerCase() === clean || (u.email && u.email.toLowerCase() === clean)) || null;
  },

  async getUserByEmail(email) {
    if (!email) return null;
    const clean = email.toLowerCase().trim();
    if (isLiveFirebase && firestoreDb) {
      const snap = await firestoreDb.collection('users').where('email', '==', clean).limit(1).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };
      }
    }
    const data = readLocalData();
    return data.users.find((u) => (u.email && u.email.toLowerCase() === clean) || (u.userId && u.userId.toLowerCase() === clean)) || null;
  },

  async getUserDocById(id) {
    if (isLiveFirebase && firestoreDb) {
      const doc = await firestoreDb.collection('users').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    }
    const data = readLocalData();
    return data.users.find((u) => u.id === id) || null;
  },

  async createUser(userData) {
    if (isLiveFirebase && firestoreDb) {
      const ref = await firestoreDb.collection('users').add(userData);
      return { id: ref.id, ...userData };
    }
    const data = readLocalData();
    const newUser = { id: 'u-' + Date.now(), ...userData };
    data.users.push(newUser);
    writeLocalData(data);
    return newUser;
  },

  async updateUser(id, updates) {
    if (isLiveFirebase && firestoreDb) {
      await firestoreDb.collection('users').doc(id).update(updates);
      const doc = await firestoreDb.collection('users').doc(id).get();
      return { id: doc.id, ...doc.data() };
    }
    const data = readLocalData();
    const idx = data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    writeLocalData(data);
    return data.users[idx];
  },

  async deleteUser(id) {
    if (isLiveFirebase && firestoreDb) {
      await firestoreDb.collection('users').doc(id).delete();
      return true;
    }
    const data = readLocalData();
    data.users = data.users.filter((u) => u.id !== id);
    writeLocalData(data);
    return true;
  },

  // --- ATTENDANCE ---
  async getTodayAttendanceForUser(userId, dateStr) {
    const today = dateStr || new Date().toISOString().split('T')[0];
    if (isLiveFirebase && firestoreDb) {
      const snap = await firestoreDb
        .collection('attendance')
        .where('userId', '==', userId)
        .where('date', '==', today)
        .limit(1)
        .get();
      if (snap.empty) return null;
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    const data = readLocalData();
    return data.attendance.find((a) => a.userId.toLowerCase() === userId.toLowerCase() && a.date === today) || null;
  },

  async getAllAttendance(filters = {}) {
    let list = [];
    if (isLiveFirebase && firestoreDb) {
      let query = firestoreDb.collection('attendance');
      if (filters.date) {
        query = query.where('date', '==', filters.date);
      }
      if (filters.userId) {
        query = query.where('userId', '==', filters.userId);
      }
      const snap = await query.get();
      list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } else {
      const data = readLocalData();
      list = [...data.attendance];
    }

    if (filters.date) {
      list = list.filter((a) => a.date === filters.date);
    }
    if (filters.startDate && filters.endDate) {
      list = list.filter((a) => a.date >= filters.startDate && a.date <= filters.endDate);
    }
    if (filters.userId) {
      list = list.filter((a) => a.userId.toLowerCase() === filters.userId.toLowerCase());
    }
    if (filters.role) {
      list = list.filter((a) => a.role === filters.role);
    }
    if (filters.department) {
      list = list.filter((a) => a.department === filters.department);
    }
    if (filters.status) {
      list = list.filter((a) => a.status === filters.status);
    }

    // Sort descending by checkInTime or date
    list.sort((a, b) => new Date(b.checkInTime || b.date) - new Date(a.checkInTime || a.date));
    return list;
  },

  async saveAttendanceRecord(record) {
    if (isLiveFirebase && firestoreDb) {
      if (record.id) {
        await firestoreDb.collection('attendance').doc(record.id).set(record, { merge: true });
        return record;
      }
      const ref = await firestoreDb.collection('attendance').add(record);
      // Also update Firebase Realtime Database liveStatus for instant kiosk/screen sync!
      if (realtimeDb) {
        try {
          await realtimeDb.ref(`liveAttendance/${record.userId}`).set({
            ...record,
            lastSync: Date.now(),
          });
        } catch (e) {
          console.warn('Realtime DB sync error:', e.message);
        }
      }
      return { id: ref.id, ...record };
    }

    const data = readLocalData();
    if (record.id) {
      const idx = data.attendance.findIndex((a) => a.id === record.id);
      if (idx !== -1) {
        data.attendance[idx] = { ...data.attendance[idx], ...record };
      } else {
        data.attendance.push(record);
      }
    } else {
      record.id = 'att-' + Date.now();
      data.attendance.push(record);
    }
    writeLocalData(data);
    return record;
  },

  // --- KIOSK DYNAMIC QR SYNC ---
  async updateKioskQr(payload) {
    if (isLiveFirebase && realtimeDb) {
      try {
        await realtimeDb.ref('kioskQr').set({
          ...payload,
          updatedAt: Date.now(),
        });
      } catch (e) {
        console.warn('Realtime DB kioskQr write error:', e.message);
      }
    }
    const data = readLocalData();
    data.kioskQr = { ...payload, updatedAt: Date.now() };
    writeLocalData(data);
  },

  // --- GEOFENCE & MAP PERIMETER CONFIG ---
  async getGeofenceConfig() {
    const data = readLocalData();
    if (data.settings && data.settings.geofence) {
      return data.settings.geofence;
    }
    return {
      enabled: process.env.GEOFENCE_ENABLED !== 'false',
      geofenceType: 'circle', // 'circle' | 'polygon'
      lat: parseFloat(process.env.GEOFENCE_LAT || '11.5564'),
      lng: parseFloat(process.env.GEOFENCE_LNG || '104.9282'),
      radiusMeters: parseInt(process.env.GEOFENCE_RADIUS_METERS || '200', 10),
      polygonCoords: [],
      locationName: 'Campus Main Entrance / Gate Screen',
      updatedAt: new Date().toISOString(),
    };
  },

  async updateGeofenceConfig(config) {
    const data = readLocalData();
    if (!data.settings) data.settings = {};
    data.settings.geofence = {
      enabled: config.enabled !== false,
      geofenceType: config.geofenceType || (config.polygonCoords?.length >= 3 ? 'polygon' : 'circle'),
      lat: parseFloat(config.lat || 11.5564),
      lng: parseFloat(config.lng || 104.9282),
      radiusMeters: parseInt(config.radiusMeters || 200, 10),
      polygonCoords: Array.isArray(config.polygonCoords) ? config.polygonCoords : [],
      locationName: config.locationName || 'Campus Main Entrance / Gate Screen',
      updatedAt: new Date().toISOString(),
    };
    writeLocalData(data);

    if (isLiveFirebase && realtimeDb) {
      try {
        await realtimeDb.ref('settings/geofence').set(data.settings.geofence);
      } catch (e) {}
    }
    return data.settings.geofence;
  },
};

module.exports = {
  admin,
  firestoreDb,
  realtimeDb,
  dbService,
};

