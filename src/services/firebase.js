// Firebase Production Service — CHAi Canine Osteology 3D Atlas (Project: anatomy-568be)
// Connected to Real Host + Authentication + RBAC Admin (`jirawat.s@msu.ac.th`) + Ultra-Low-Quota Spark $0 Architecture:
// 1. Built-in production `anatomy-568be` Firebase config + safe lazy Analytics (`firebase/analytics`).
// 2. Firebase Auth (`GoogleAuthProvider` + `Email/Password` — $0 free up to 50,000 MAUs; zero paid SMS auth).
// 3. `jirawat.s@msu.ac.th` permanently recognized as Super Admin (`role: 'super_admin'`).
// 4. `firebase/firestore/lite` (REST-only, zero `onSnapshot` listeners) + Single-Doc Aggregation:
//    - `canine_atlas_meta/catalog_v2` (31 bones + pathologies + portal settings = 1 Read cached 24h, 1 Write on Admin edit)
//    - `canine_atlas_meta/users_registry_v1` (all user roles/status = 1 Read for Admin table)
//    - `canine_user_state/{uid}` (per-user notes + bookmarks + studied = 2.5s Debounced + Diff-Checked 1 Write)
// 5. Daily Client Quota Circuit Breaker (`MAX_DAILY_READS_PER_CLIENT`, `MAX_DAILY_WRITES_PER_CLIENT`).

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore/lite';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { CANINE_BONES, VET_PATHOLOGIES } from '../data/canineSkeletonData';

// Real Production Firebase Host Configuration (`anatomy-568be`)
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBMQuH85SmRKEbDGxDl8W0MunFEz0bEYm0',
  authDomain: 'anatomy-568be.firebaseapp.com',
  databaseURL: 'https://anatomy-568be-default-rtdb.firebaseio.com',
  projectId: 'anatomy-568be',
  storageBucket: 'anatomy-568be.firebasestorage.app',
  messagingSenderId: '732920561466',
  appId: '1:732920561466:web:5571485c62dc9ef768da03',
  measurementId: 'G-5PM632TLR8'
};

export const PRIMARY_ADMIN_EMAIL = 'jirawat.s@msu.ac.th';

export const isPrimaryAdminEmail = (email) =>
  typeof email === 'string' && email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL;

export const DEFAULT_ATLAS_SETTINGS = {
  portalTitle: 'CHAi Canine Osteology Atlas',
  institutionName: 'มหาวิทยาลัยมหาสารคาม (MSU) · Veterinary Osteology 3D',
  announcementEnabled: false,
  announcementText: 'ยินดีต้อนรับสู่ระบบฐานข้อมูลโครงกระดูกสุนัข 3 มิติ (115 ชิ้นกระดูก · กะโหลก 3 ประเภท)',
  announcementColor: 'blue',
  defaultCephalicType: 'mesocephalic',
  maintenanceMode: false
};

const FIREBASE_STORAGE_KEY = 'canine_atlas_firebase_config';
const LOCAL_NOTES_PREFIX = 'canine_atlas_notes_';
const LOCAL_BOOKMARKS_PREFIX = 'canine_atlas_bookmarks_';
const LOCAL_STUDIED_PREFIX = 'canine_atlas_studied_';
const USER_STATE_SYNC_TS_PREFIX = 'canine_atlas_user_sync_ts_';
const USER_REGISTRY_SYNC_TS_PREFIX = 'canine_atlas_reg_sync_ts_';
const CATALOG_CACHE_KEY = 'canine_atlas_cloud_catalog_cache_v3';
const USERS_REGISTRY_CACHE_KEY = 'canine_atlas_users_registry_cache_v1';
const QUOTA_GUARD_KEY = 'canine_atlas_daily_quota_guard_v1';
const DEVICE_ID_KEY = 'canine_atlas_anon_device_id';

// 24 hours cache TTL -> maximum ~1 Firestore Read per user per day!
const CATALOG_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const USER_STATE_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_DAILY_READS_PER_CLIENT = 25;
export const MAX_DAILY_WRITES_PER_CLIENT = 60;
const WRITE_DEBOUNCE_MS = 2500;

const safeStorage = {
  getItem: (k) => {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null;
    } catch {
      return null;
    }
  },
  setItem: (k, v) => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(k, v);
    } catch {
      // ignore storage quota errors
    }
  },
  removeItem: (k) => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(k);
    } catch {
      // ignore
    }
  }
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getAnonDeviceId = () => {
  let id = safeStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = 'student_' + Math.random().toString(36).slice(2, 10);
    safeStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

// Active user scope (uses Firebase Auth UID when signed in)
let activeUserProfile = null;
const getActiveScopeId = () => activeUserProfile?.uid || getAnonDeviceId();

// Track & enforce daily client-side read/write circuit breaker
export const getFirebaseQuotaStats = () => {
  const today = getTodayKey();
  try {
    const parsed = JSON.parse(safeStorage.getItem(QUOTA_GUARD_KEY) || '{}');
    if (parsed.date === today) {
      return {
        date: today,
        reads: parsed.reads || 0,
        writes: parsed.writes || 0,
        maxReads: MAX_DAILY_READS_PER_CLIENT,
        maxWrites: MAX_DAILY_WRITES_PER_CLIENT
      };
    }
  } catch {
    // ignore corrupt local stats
  }
  return {
    date: today,
    reads: 0,
    writes: 0,
    maxReads: MAX_DAILY_READS_PER_CLIENT,
    maxWrites: MAX_DAILY_WRITES_PER_CLIENT
  };
};

const consumeQuota = (type, amount = 1) => {
  const stats = getFirebaseQuotaStats();
  // Super Admin management operations get generous headroom while still preventing runaway infinite loops
  const readCap = activeUserProfile?.isAdmin ? 200 : MAX_DAILY_READS_PER_CLIENT;
  const writeCap = activeUserProfile?.isAdmin ? 200 : MAX_DAILY_WRITES_PER_CLIENT;

  if (type === 'read') {
    if (stats.reads + amount > readCap) {
      console.warn('[Firebase Quota Guard] Daily client read cap reached — serving from local cache.');
      return false;
    }
    stats.reads += amount;
  } else {
    if (stats.writes + amount > writeCap) {
      console.warn('[Firebase Quota Guard] Daily client write cap reached — saving to LocalStorage only.');
      return false;
    }
    stats.writes += amount;
  }
  safeStorage.setItem(
    QUOTA_GUARD_KEY,
    JSON.stringify({ date: stats.date, reads: stats.reads, writes: stats.writes })
  );
  return true;
};

export const getActiveFirebaseConfig = () => {
  const stored = safeStorage.getItem(FIREBASE_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.apiKey && parsed?.projectId) return parsed;
    } catch (e) {
      console.warn('Invalid stored Firebase config', e);
    }
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };
  }

  return DEFAULT_FIREBASE_CONFIG;
};

let app = null;
let db = null;
let auth = null;
let analyticsInitialized = false;
let isFirebaseReady = false;

export const initFirebase = (customConfig = null) => {
  const config = customConfig || getActiveFirebaseConfig();

  if (!config || !config.apiKey || !config.projectId) {
    isFirebaseReady = false;
    return { isReady: false, mode: 'local' };
  }

  try {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    auth.languageCode = 'th';
    isFirebaseReady = true;

    if (customConfig) {
      safeStorage.setItem(FIREBASE_STORAGE_KEY, JSON.stringify(config));
    }

    // Safely initialize Firebase Analytics in browser only when supported ($0 free service)
    if (!analyticsInitialized && typeof window !== 'undefined' && config.measurementId) {
      analyticsInitialized = true;
      import('firebase/analytics')
        .then(({ isSupported, getAnalytics }) =>
          isSupported().then((ok) => {
            if (ok && app) getAnalytics(app);
          })
        )
        .catch(() => {
          // Ignore analytics blocker / offline environments
        });
    }

    return { isReady: true, mode: 'firebase', projectId: config.projectId };
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
    isFirebaseReady = false;
    return { isReady: false, error: err.message, mode: 'error' };
  }
};

export const isConnectedToFirebase = () => isFirebaseReady && db !== null;
export const getCurrentUserProfile = () => activeUserProfile;

export const saveFirebaseConfig = (config) => {
  if (!config) {
    safeStorage.removeItem(FIREBASE_STORAGE_KEY);
    safeStorage.removeItem(CATALOG_CACHE_KEY);
    return initFirebase(DEFAULT_FIREBASE_CONFIG);
  }
  return initFirebase(config);
};

// ==================== AUTHENTICATION & ADMIN RBAC ====================

export const translateAuthError = (err) => {
  const code = err?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง (หรือเข้าสู่ระบบด้วยบัญชี Google)';
    case 'auth/invalid-email':
      return 'รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกอีเมลให้ครบถ้วน';
    case 'auth/email-already-in-use':
      return 'อีเมลนี้มีบัญชีในระบบแล้ว กรุณาสลับไปหน้า "เข้าสู่ระบบ"';
    case 'auth/weak-password':
      return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    case 'auth/popup-closed-by-user':
      return 'คุณปิดหน้าต่างเข้าสู่ระบบ Google ก่อนดำเนินการเสร็จสิ้น';
    case 'auth/cancelled-popup-request':
      return 'กำลังเปิดหน้าต่างยืนยันตัวตน กรุณารอสักครู่';
    case 'auth/operation-not-allowed':
      return 'ขณะนี้โปรเจกต์เปิดใช้งานการเข้าสู่ระบบด้วยปุ่ม Google เป็นหลัก (หากต้องการใช้รหัสผ่านอีเมลแยก ผู้ดูแลระบบสามารถกด Enable Email/Password ใน Firebase Console > Authentication > Sign-in method เพิ่มได้ฟรี)';
    case 'auth/unauthorized-domain':
      return 'โดเมนนี้ยังไม่ได้เพิ่มในรายการ Authorized domains ของ Firebase Authentication';
    case 'auth/too-many-requests':
      return 'มีการพยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง';
    case 'auth/network-request-failed':
      return 'ไม่สามารถเชื่อมต่อเครือข่ายได้ กรุณาตรวจสอบอินเทอร์เน็ตของคุณ';
    default:
      return err?.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน กรุณาลองใหม่อีกครั้ง';
  }
};

const normalizeEmailKey = (email) =>
  (email || '').trim().toLowerCase().replace(/[.#$/[\]]/g, '_');

/**
 * Resolves user's role (`super_admin` | `admin` | `member`) & syncs user registry with minimal quota (<= 1 Read/Write per 24h).
 */
const resolveAndSyncUserProfile = async (fbUser) => {
  const email = (fbUser.email || '').trim().toLowerCase();
  const isSuperAdmin = isPrimaryAdminEmail(email);

  let role = isSuperAdmin ? 'super_admin' : 'member';
  let status = 'active';
  let registryData = null;

  // Read cached registry first; refresh once per 24h so role promotions / suspensions apply cleanly
  try {
    const cachedReg = JSON.parse(safeStorage.getItem(USERS_REGISTRY_CACHE_KEY) || 'null');
    if (cachedReg && cachedReg.fetchedAt && Date.now() - cachedReg.fetchedAt < USER_STATE_TTL_MS) {
      registryData = cachedReg.data;
    }
  } catch {
    // ignore
  }

  if (!registryData && isConnectedToFirebase() && consumeQuota('read', 1)) {
    try {
      const regSnap = await getDoc(doc(db, 'canine_atlas_meta', 'users_registry_v1'));
      registryData = regSnap.exists() ? regSnap.data() : { users: {}, preAuthorized: {} };
      safeStorage.setItem(
        USERS_REGISTRY_CACHE_KEY,
        JSON.stringify({ fetchedAt: Date.now(), data: registryData })
      );
    } catch (err) {
      console.warn('Could not read users_registry_v1 (using default role):', err);
    }
  }

  const existingEntry = registryData?.users?.[fbUser.uid];
  const preAuthRole = email ? registryData?.preAuthorized?.[normalizeEmailKey(email)]?.role : null;

  if (isSuperAdmin) {
    role = 'super_admin';
    status = 'active';
  } else if (existingEntry) {
    role = existingEntry.role || preAuthRole || 'member';
    status = existingEntry.status || 'active';
  } else if (preAuthRole) {
    role = preAuthRole;
  }

  const isAdmin = isSuperAdmin || role === 'admin' || role === 'super_admin';

  const profile = {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName:
      fbUser.displayName ||
      existingEntry?.displayName ||
      (isSuperAdmin ? 'ผู้ดูแลระบบหลัก (MSU Admin)' : email.split('@')[0] || 'ผู้ใช้งาน'),
    photoURL: fbUser.photoURL || existingEntry?.photoURL || '',
    role,
    isAdmin,
    isSuperAdmin,
    status,
    createdAt: existingEntry?.createdAt || new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  activeUserProfile = profile;

  // Sync user entry to `users_registry_v1` at most once per 24h (or on very first registration) -> saves Write quota!
  const lastRegSync = Number(safeStorage.getItem(USER_REGISTRY_SYNC_TS_PREFIX + fbUser.uid) || 0);
  const needsRegistrySync =
    !existingEntry ||
    existingEntry.role !== role ||
    Date.now() - lastRegSync > USER_STATE_TTL_MS;

  if (needsRegistrySync && isConnectedToFirebase() && consumeQuota('write', 1)) {
    try {
      const studiedCount = getStudiedBones().length;
      const entryPayload = {
        uid: profile.uid,
        email: profile.email,
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        role: profile.role,
        status: profile.status,
        studiedCount,
        createdAt: profile.createdAt,
        lastLoginAt: profile.lastLoginAt
      };
      await setDoc(
        doc(db, 'canine_atlas_meta', 'users_registry_v1'),
        {
          updatedAt: new Date().toISOString(),
          users: {
            [fbUser.uid]: entryPayload
          }
        },
        { merge: true }
      );
      safeStorage.setItem(USER_REGISTRY_SYNC_TS_PREFIX + fbUser.uid, String(Date.now()));
      if (registryData) {
        registryData.users = { ...(registryData.users || {}), [fbUser.uid]: entryPayload };
        safeStorage.setItem(
          USERS_REGISTRY_CACHE_KEY,
          JSON.stringify({ fetchedAt: Date.now(), data: registryData })
        );
      }
    } catch (err) {
      console.warn('User registry sync skipped:', err);
    }
  }

  // Hydrate per-user studied/bookmarks/notes (cached 24h -> 0 extra reads on reloads)
  await hydrateUserStudyState(fbUser.uid);

  return profile;
};

export const subscribeToAuthChanges = (onChange) => {
  if (!auth) initFirebase();
  if (!auth) {
    onChange(null);
    return () => {};
  }

  // Complete any pending redirect sign-in silently
  getRedirectResult(auth).catch(() => {});

  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      activeUserProfile = null;
      onChange(null);
      return;
    }
    try {
      const profile = await resolveAndSyncUserProfile(fbUser);
      onChange(profile);
    } catch (err) {
      console.error('Auth profile resolution error:', err);
      const fallbackIsSuper = isPrimaryAdminEmail(fbUser.email);
      const fallback = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || fbUser.email || 'ผู้ใช้งาน',
        photoURL: fbUser.photoURL || '',
        role: fallbackIsSuper ? 'super_admin' : 'member',
        isAdmin: fallbackIsSuper,
        isSuperAdmin: fallbackIsSuper,
        status: 'active'
      };
      activeUserProfile = fallback;
      onChange(fallback);
    }
  });
};

export const loginWithGoogle = async () => {
  if (!auth) initFirebase();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (err) {
    if (err?.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
};

export const loginWithEmail = async (email, password) => {
  if (!auth) initFirebase();
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
};

export const registerWithEmail = async (email, password, displayName = '') => {
  if (!auth) initFirebase();
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }
  return cred.user;
};

export const sendPasswordReset = async (email) => {
  if (!auth) initFirebase();
  await sendPasswordResetEmail(auth, email.trim());
};

export const logoutUser = async () => {
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
    await flushUserStateSyncNow();
  }
  activeUserProfile = null;
  if (auth) {
    await signOut(auth);
  }
};

// ==================== CATALOG, PATHOLOGIES & PORTAL SETTINGS ====================

const mergeCloudCatalog = (rawCatalog) => {
  const bonesMap = rawCatalog?.bones || {};
  const mergedBones = CANINE_BONES.map((baseBone) => {
    const override = bonesMap[baseBone.id];
    if (!override) return baseBone;
    return {
      ...baseBone,
      ...override,
      // Always preserve 3D GLB mesh bindings so text edits can never break the 3D scene
      id: baseBone.id,
      meshes: baseBone.meshes,
      subPieces: baseBone.subPieces,
      isCloudCustomized: Boolean(override.isCloudCustomized)
    };
  });

  let mergedPathologies = VET_PATHOLOGIES;
  if (Array.isArray(rawCatalog?.pathologiesList) && rawCatalog.pathologiesList.length > 0) {
    mergedPathologies = rawCatalog.pathologiesList;
  } else if (rawCatalog?.pathologies && typeof rawCatalog.pathologies === 'object') {
    const vals = Object.values(rawCatalog.pathologies);
    if (vals.length > 0) mergedPathologies = vals;
  }

  const mergedSettings = {
    ...DEFAULT_ATLAS_SETTINGS,
    ...(rawCatalog?.settings || {})
  };

  return {
    bones: mergedBones,
    pathologies: mergedPathologies,
    settings: mergedSettings,
    rawCatalog: rawCatalog || {},
    updatedAt: rawCatalog?.updatedAt || null,
    updatedBy: rawCatalog?.updatedBy || null
  };
};

const readLocalCatalogCache = () => {
  try {
    const cached = JSON.parse(safeStorage.getItem(CATALOG_CACHE_KEY) || 'null');
    if (cached && cached.fetchedAt && Date.now() - cached.fetchedAt < CATALOG_CACHE_TTL_MS) {
      return cached.rawCatalog || {};
    }
  } catch {
    // ignore invalid cache
  }
  return null;
};

const writeLocalCatalogCache = (rawCatalog) => {
  safeStorage.setItem(
    CATALOG_CACHE_KEY,
    JSON.stringify({ fetchedAt: Date.now(), rawCatalog })
  );
};

/**
 * Fetch complete catalog bundle (bones + pathologies + portal settings) using <= 1 Read per 24h!
 */
export const fetchCatalogBundle = async (forceRefresh = false) => {
  if (!isConnectedToFirebase()) {
    return mergeCloudCatalog(null);
  }

  if (!forceRefresh) {
    const cachedRaw = readLocalCatalogCache();
    if (cachedRaw) {
      return mergeCloudCatalog(cachedRaw);
    }
  }

  if (!consumeQuota('read', 1)) {
    return mergeCloudCatalog(readLocalCatalogCache());
  }

  try {
    const catalogRef = doc(db, 'canine_atlas_meta', 'catalog_v2');
    const snap = await getDoc(catalogRef);
    if (snap.exists()) {
      const rawCatalog = snap.data();
      writeLocalCatalogCache(rawCatalog);
      return mergeCloudCatalog(rawCatalog);
    } else {
      writeLocalCatalogCache({});
    }
  } catch (err) {
    console.warn('Firestore single-doc read fallback to local dataset:', err);
  }

  return mergeCloudCatalog(readLocalCatalogCache());
};

export const fetchAllBones = async (forceRefresh = false) => {
  const bundle = await fetchCatalogBundle(forceRefresh);
  return bundle.bones;
};

// ==================== PER-USER STUDY PROGRESS & NOTES ====================

const hydrateUserStudyState = async (uid) => {
  if (!uid || !isConnectedToFirebase()) return;
  const syncKey = USER_STATE_SYNC_TS_PREFIX + uid;
  const lastFetched = Number(safeStorage.getItem(syncKey) || 0);
  if (Date.now() - lastFetched < USER_STATE_TTL_MS) {
    return; // 0 Firestore Reads within 24h window!
  }

  if (!consumeQuota('read', 1)) return;

  try {
    const snap = await getDoc(doc(db, 'canine_user_state', uid));
    safeStorage.setItem(syncKey, String(Date.now()));
    if (!snap.exists()) return;

    const cloud = snap.data() || {};
    const localStudied = getStudiedBones();
    const localBookmarks = getBookmarkedBones();
    const localNotes = getLocalNotes();

    const mergedStudied = Array.from(
      new Set([...(cloud.studiedBoneIds || []), ...localStudied])
    );
    const mergedBookmarks = Array.from(
      new Set([...(cloud.bookmarkedBoneIds || []), ...localBookmarks])
    );
    const mergedNotes = { ...(cloud.notes || {}), ...localNotes };

    safeStorage.setItem(LOCAL_STUDIED_PREFIX + uid, JSON.stringify(mergedStudied));
    safeStorage.setItem(LOCAL_BOOKMARKS_PREFIX + uid, JSON.stringify(mergedBookmarks));
    safeStorage.setItem(LOCAL_NOTES_PREFIX + uid, JSON.stringify(mergedNotes));
  } catch (err) {
    console.warn('Could not hydrate user study state:', err);
  }
};

let syncTimer = null;
let lastSyncedHash = '';

const flushUserStateSyncNow = async () => {
  if (!isConnectedToFirebase() || !activeUserProfile?.uid) return;
  const uid = activeUserProfile.uid;

  const payload = {
    email: activeUserProfile.email || '',
    studiedBoneIds: getStudiedBones(),
    bookmarkedBoneIds: getBookmarkedBones(),
    notes: getLocalNotes()
  };

  const currentHash = JSON.stringify(payload);
  if (currentHash === lastSyncedHash) return;
  if (!consumeQuota('write', 1)) return;

  try {
    await setDoc(
      doc(db, 'canine_user_state', uid),
      {
        ...payload,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    lastSyncedHash = currentHash;
  } catch (err) {
    console.warn('Failed to sync batched user state to Firestore:', err);
  }
};

const scheduleUserStateSync = () => {
  if (!isConnectedToFirebase() || !activeUserProfile?.uid) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    flushUserStateSyncNow();
  }, WRITE_DEBOUNCE_MS);
};

export const getLocalNotes = () => {
  try {
    const raw = safeStorage.getItem(LOCAL_NOTES_PREFIX + getActiveScopeId());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveBoneNote = async (boneId, noteText) => {
  const scopeId = getActiveScopeId();
  const localNotes = getLocalNotes();
  const prevText = localNotes[boneId]?.text ?? '';
  if (prevText === noteText) {
    return localNotes[boneId] || { text: noteText };
  }

  const timestamp = new Date().toISOString();
  localNotes[boneId] = { text: noteText, updatedAt: timestamp };
  safeStorage.setItem(LOCAL_NOTES_PREFIX + scopeId, JSON.stringify(localNotes));
  scheduleUserStateSync();
  return localNotes[boneId];
};

export const getBookmarkedBones = () => {
  try {
    const raw = safeStorage.getItem(LOCAL_BOOKMARKS_PREFIX + getActiveScopeId());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleBookmarkBone = (boneId) => {
  const scopeId = getActiveScopeId();
  const list = getBookmarkedBones();
  const updated = list.includes(boneId)
    ? list.filter((id) => id !== boneId)
    : [...list, boneId];
  safeStorage.setItem(LOCAL_BOOKMARKS_PREFIX + scopeId, JSON.stringify(updated));
  scheduleUserStateSync();
  return updated;
};

export const getStudiedBones = () => {
  try {
    const raw = safeStorage.getItem(LOCAL_STUDIED_PREFIX + getActiveScopeId());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleStudiedBone = async (boneId) => {
  const scopeId = getActiveScopeId();
  const list = getStudiedBones();
  const updated = list.includes(boneId)
    ? list.filter((id) => id !== boneId)
    : [...list, boneId];
  safeStorage.setItem(LOCAL_STUDIED_PREFIX + scopeId, JSON.stringify(updated));
  scheduleUserStateSync();
  return updated;
};

// ==================== ADMIN DATA MANAGEMENT STUDIO APIs ====================

const assertAdminAccess = () => {
  if (!isConnectedToFirebase()) {
    throw new Error('ยังไม่ได้เชื่อมต่อ Firebase Cloud');
  }
  if (!activeUserProfile?.isAdmin) {
    throw new Error('จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น');
  }
};

const getLatestRawCatalogForEdit = async () => {
  const cached = readLocalCatalogCache();
  if (cached && Object.keys(cached).length > 0) return cached;
  if (consumeQuota('read', 1)) {
    const snap = await getDoc(doc(db, 'canine_atlas_meta', 'catalog_v2'));
    if (snap.exists()) return snap.data();
  }
  return {};
};

/**
 * Admin: Save edits to any of the 31 osteological structures (1 Write)
 */
export const adminSaveBoneOverride = async (boneId, updatedFields) => {
  assertAdminAccess();
  if (!consumeQuota('write', 1)) {
    throw new Error('ถึงเพดานป้องกันโควตาการเขียนรายวันของเบราว์เซอร์นี้แล้ว');
  }

  const rawCatalog = await getLatestRawCatalogForEdit();
  const baseBone = CANINE_BONES.find((b) => b.id === boneId);
  if (!baseBone) throw new Error(`ไม่พบรหัสโครงสร้างกระดูก: ${boneId}`);

  const { subPieces, meshes, ...serializableBase } = baseBone;
  const nextBoneData = {
    ...serializableBase,
    ...(rawCatalog.bones?.[boneId] || {}),
    ...updatedFields,
    id: boneId,
    isCloudCustomized: true,
    updatedAt: new Date().toISOString(),
    updatedBy: activeUserProfile.email
  };

  const nextRawCatalog = {
    ...rawCatalog,
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    updatedBy: activeUserProfile.email,
    bones: {
      ...(rawCatalog.bones || {}),
      [boneId]: nextBoneData
    }
  };

  await setDoc(doc(db, 'canine_atlas_meta', 'catalog_v2'), nextRawCatalog, { merge: true });
  writeLocalCatalogCache(nextRawCatalog);
  return mergeCloudCatalog(nextRawCatalog);
};

/**
 * Admin: Restore a single bone structure back to factory NAV default (1 Write)
 */
export const adminResetBoneToDefault = async (boneId) => {
  assertAdminAccess();
  if (!consumeQuota('write', 1)) {
    throw new Error('ถึงเพดานป้องกันโควตาการเขียนรายวันของเบราว์เซอร์นี้แล้ว');
  }

  const rawCatalog = await getLatestRawCatalogForEdit();
  const baseBone = CANINE_BONES.find((b) => b.id === boneId);
  if (!baseBone) throw new Error(`ไม่พบรหัสโครงสร้างกระดูก: ${boneId}`);

  const { subPieces, ...serializableBase } = baseBone;
  const cleanDefault = {
    ...serializableBase,
    isCloudCustomized: false,
    subPieceCount: baseBone.meshes.length,
    subPieces: (subPieces || []).map(({ meshName, shortLabel, labelTh, labelEn, side }) => ({
      meshName,
      shortLabel,
      labelTh,
      labelEn,
      side
    }))
  };

  const nextRawCatalog = {
    ...rawCatalog,
    updatedAt: new Date().toISOString(),
    updatedBy: activeUserProfile.email,
    bones: {
      ...(rawCatalog.bones || {}),
      [boneId]: cleanDefault
    }
  };

  await setDoc(doc(db, 'canine_atlas_meta', 'catalog_v2'), nextRawCatalog);
  writeLocalCatalogCache(nextRawCatalog);
  return mergeCloudCatalog(nextRawCatalog);
};

/**
 * Admin: Save updated clinical pathologies list (Create / Update / Delete) in 1 Write!
 */
export const adminSavePathologies = async (pathologiesList) => {
  assertAdminAccess();
  if (!consumeQuota('write', 1)) {
    throw new Error('ถึงเพดานป้องกันโควตาการเขียนรายวันของเบราว์เซอร์นี้แล้ว');
  }

  const rawCatalog = await getLatestRawCatalogForEdit();
  const pathologiesMap = {};
  for (const item of pathologiesList) {
    pathologiesMap[item.id] = item;
  }

  const nextRawCatalog = {
    ...rawCatalog,
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    updatedBy: activeUserProfile.email,
    pathologiesList,
    pathologies: pathologiesMap
  };

  await setDoc(doc(db, 'canine_atlas_meta', 'catalog_v2'), nextRawCatalog);
  writeLocalCatalogCache(nextRawCatalog);
  return mergeCloudCatalog(nextRawCatalog);
};

/**
 * Admin: Save portal announcement banner & system settings in 1 Write!
 */
export const adminSavePortalSettings = async (settingsPatch) => {
  assertAdminAccess();
  if (!consumeQuota('write', 1)) {
    throw new Error('ถึงเพดานป้องกันโควตาการเขียนรายวันของเบราว์เซอร์นี้แล้ว');
  }

  const rawCatalog = await getLatestRawCatalogForEdit();
  const nextRawCatalog = {
    ...rawCatalog,
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    updatedBy: activeUserProfile.email,
    settings: {
      ...DEFAULT_ATLAS_SETTINGS,
      ...(rawCatalog.settings || {}),
      ...settingsPatch
    }
  };

  await setDoc(doc(db, 'canine_atlas_meta', 'catalog_v2'), nextRawCatalog, { merge: true });
  writeLocalCatalogCache(nextRawCatalog);
  return mergeCloudCatalog(nextRawCatalog);
};

/**
 * Admin: Import full JSON backup (`bones`, `pathologiesList`, `settings`) in 1 Write!
 */
export const adminImportFullCatalogJson = async (importedObj) => {
  assertAdminAccess();
  if (!importedObj || typeof importedObj !== 'object') {
    throw new Error('ไฟล์ JSON ไม่ถูกต้อง');
  }
  if (!consumeQuota('write', 1)) {
    throw new Error('ถึงเพดานป้องกันโควตาการเขียนรายวันของเบราว์เซอร์นี้แล้ว');
  }

  const nextRawCatalog = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    updatedBy: activeUserProfile.email,
    structureCount: CANINE_BONES.length,
    totalMeshCount: 115,
    bones: importedObj.bones || {},
    pathologiesList: importedObj.pathologiesList || VET_PATHOLOGIES,
    pathologies: importedObj.pathologies || {},
    settings: {
      ...DEFAULT_ATLAS_SETTINGS,
      ...(importedObj.settings || {})
    }
  };

  await setDoc(doc(db, 'canine_atlas_meta', 'catalog_v2'), nextRawCatalog);
  writeLocalCatalogCache(nextRawCatalog);
  return mergeCloudCatalog(nextRawCatalog);
};

/**
 * Admin: Fetch all registered users & pre-authorized emails in 1 single Firestore Read!
 */
export const adminFetchUsersRegistry = async (forceRefresh = true) => {
  assertAdminAccess();

  if (!forceRefresh) {
    try {
      const cached = JSON.parse(safeStorage.getItem(USERS_REGISTRY_CACHE_KEY) || 'null');
      if (cached?.data) return formatRegistryOutput(cached.data);
    } catch {
      // ignore
    }
  }

  if (!consumeQuota('read', 1)) {
    const cached = JSON.parse(safeStorage.getItem(USERS_REGISTRY_CACHE_KEY) || 'null');
    return formatRegistryOutput(cached?.data || {});
  }

  const snap = await getDoc(doc(db, 'canine_atlas_meta', 'users_registry_v1'));
  const data = snap.exists() ? snap.data() : { users: {}, preAuthorized: {} };
  safeStorage.setItem(
    USERS_REGISTRY_CACHE_KEY,
    JSON.stringify({ fetchedAt: Date.now(), data })
  );
  return formatRegistryOutput(data);
};

const formatRegistryOutput = (data) => {
  const usersMap = data?.users || {};
  const usersList = Object.values(usersMap).sort((a, b) => {
    if (isPrimaryAdminEmail(a.email)) return -1;
    if (isPrimaryAdminEmail(b.email)) return 1;
    return String(b.lastLoginAt || '').localeCompare(String(a.lastLoginAt || ''));
  });
  const preAuthorizedList = Object.values(data?.preAuthorized || {});
  return { usersList, preAuthorizedList, rawData: data };
};

/**
 * Admin: Update a user's role (`admin` | `member`) or status (`active` | `suspended`) in 1 Write!
 */
export const adminUpdateUserRoleOrStatus = async (targetUid, patch) => {
  assertAdminAccess();
  const current = await adminFetchUsersRegistry(false);
  const targetUser = current.rawData?.users?.[targetUid];
  if (!targetUser) throw new Error('ไม่พบข้อมูลผู้ใช้งานนี้ในระบบ');

  if (isPrimaryAdminEmail(targetUser.email)) {
    throw new Error(`ไม่สามารถลดสิทธิ์หรือระงับผู้ดูแลระบบหลัก (${PRIMARY_ADMIN_EMAIL}) ได้`);
  }

  if (!consumeQuota('write', 1)) {
    throw new Error('ถึงเพดานป้องกันโควตาการเขียนรายวันของเบราว์เซอร์นี้แล้ว');
  }

  const updatedUser = {
    ...targetUser,
    ...patch,
    updatedAt: new Date().toISOString(),
    updatedBy: activeUserProfile.email
  };

  const nextData = {
    ...(current.rawData || {}),
    updatedAt: new Date().toISOString(),
    users: {
      ...(current.rawData?.users || {}),
      [targetUid]: updatedUser
    }
  };

  await setDoc(doc(db, 'canine_atlas_meta', 'users_registry_v1'), nextData);
  safeStorage.setItem(
    USERS_REGISTRY_CACHE_KEY,
    JSON.stringify({ fetchedAt: Date.now(), data: nextData })
  );
  return formatRegistryOutput(nextData);
};

/**
 * Admin: Pre-authorize an email (e.g. colleague `@msu.ac.th`) as `admin` or `member` before first sign-in (1 Write)
 */
export const adminSetPreAuthorizedEmail = async (email, role = 'admin') => {
  assertAdminAccess();
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('กรุณากรอกอีเมลให้ถูกต้อง');
  }
  if (!consumeQuota('write', 1)) {
    throw new Error('ถึงเพดานป้องกันโควตาการเขียนรายวันของเบราว์เซอร์นี้แล้ว');
  }

  const current = await adminFetchUsersRegistry(false);
  const key = normalizeEmailKey(cleanEmail);
  const nextPreAuth = {
    ...(current.rawData?.preAuthorized || {}),
    [key]: {
      email: cleanEmail,
      role: isPrimaryAdminEmail(cleanEmail) ? 'super_admin' : role,
      addedBy: activeUserProfile.email,
      addedAt: new Date().toISOString()
    }
  };

  // Also immediately upgrade any already-registered user matching this email
  const nextUsers = { ...(current.rawData?.users || {}) };
  for (const uid of Object.keys(nextUsers)) {
    if ((nextUsers[uid]?.email || '').trim().toLowerCase() === cleanEmail && !isPrimaryAdminEmail(cleanEmail)) {
      nextUsers[uid] = { ...nextUsers[uid], role };
    }
  }

  const nextData = {
    ...(current.rawData || {}),
    updatedAt: new Date().toISOString(),
    users: nextUsers,
    preAuthorized: nextPreAuth
  };

  await setDoc(doc(db, 'canine_atlas_meta', 'users_registry_v1'), nextData);
  safeStorage.setItem(
    USERS_REGISTRY_CACHE_KEY,
    JSON.stringify({ fetchedAt: Date.now(), data: nextData })
  );
  return formatRegistryOutput(nextData);
};

export const adminRemovePreAuthorizedEmail = async (email) => {
  assertAdminAccess();
  const cleanEmail = (email || '').trim().toLowerCase();
  if (isPrimaryAdminEmail(cleanEmail)) {
    throw new Error(`ไม่สามารถลบสิทธิ์ของผู้ดูแลระบบหลัก (${PRIMARY_ADMIN_EMAIL}) ได้`);
  }
  if (!consumeQuota('write', 1)) {
    throw new Error('ถึงเพดานป้องกันโควตาการเขียนรายวันของเบราว์เซอร์นี้แล้ว');
  }

  const current = await adminFetchUsersRegistry(false);
  const key = normalizeEmailKey(cleanEmail);
  const nextPreAuth = { ...(current.rawData?.preAuthorized || {}) };
  delete nextPreAuth[key];

  const nextData = {
    ...(current.rawData || {}),
    updatedAt: new Date().toISOString(),
    preAuthorized: nextPreAuth
  };

  await setDoc(doc(db, 'canine_atlas_meta', 'users_registry_v1'), nextData);
  safeStorage.setItem(
    USERS_REGISTRY_CACHE_KEY,
    JSON.stringify({ fetchedAt: Date.now(), data: nextData })
  );
  return formatRegistryOutput(nextData);
};

/**
 * Ultra-Economical 1-Write Firestore Seed / Reset!
 */
export const seedFirestoreWithCanineData = async () => {
  if (!isConnectedToFirebase()) {
    throw new Error('ยังไม่ได้เชื่อมต่อ Firebase');
  }
  if (!activeUserProfile?.isAdmin) {
    throw new Error('จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น');
  }
  if (!consumeQuota('write', 1)) {
    throw new Error('ถึงเพดานป้องกันโควตาการเขียนรายวันของเบราว์เซอร์นี้แล้ว');
  }

  const bonesMap = {};
  for (const bone of CANINE_BONES) {
    const { subPieces, ...serializableBone } = bone;
    bonesMap[bone.id] = {
      ...serializableBone,
      isCloudCustomized: false,
      subPieceCount: bone.meshes.length,
      subPieces: (subPieces || []).map(({ meshName, shortLabel, labelTh, labelEn, side }) => ({
        meshName,
        shortLabel,
        labelTh,
        labelEn,
        side
      }))
    };
  }

  const pathologiesMap = {};
  for (const p of VET_PATHOLOGIES) {
    pathologiesMap[p.id] = p;
  }

  const rawPayload = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    updatedBy: activeUserProfile.email,
    structureCount: CANINE_BONES.length,
    totalMeshCount: 115,
    bones: bonesMap,
    pathologiesList: VET_PATHOLOGIES,
    pathologies: pathologiesMap,
    settings: DEFAULT_ATLAS_SETTINGS
  };

  await setDoc(doc(db, 'canine_atlas_meta', 'catalog_v2'), rawPayload);
  writeLocalCatalogCache(rawPayload);

  return {
    success: true,
    count: CANINE_BONES.length,
    meshCount: 115,
    writesUsed: 1,
    bundle: mergeCloudCatalog(rawPayload)
  };
};

initFirebase();
