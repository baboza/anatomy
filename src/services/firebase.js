// Firebase Service for CHAi Canine 3D Osteology Atlas
// Seamless Dual-Mode: Cloud Firestore when configured + Instant LocalStorage Offline Mode
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { CANINE_BONES, VET_PATHOLOGIES } from '../data/canineSkeletonData';

const FIREBASE_STORAGE_KEY = 'canine_atlas_firebase_config';
const LOCAL_NOTES_KEY = 'canine_atlas_local_notes_v2';
const LOCAL_BOOKMARKS_KEY = 'canine_atlas_local_bookmarks_v2';
const LOCAL_STUDIED_KEY = 'canine_atlas_studied_bones_v2';

export const getActiveFirebaseConfig = () => {
  const stored = localStorage.getItem(FIREBASE_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Invalid stored Firebase config', e);
    }
  }

  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }

  return null;
};

let app = null;
let db = null;
let auth = null;
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
    isFirebaseReady = true;
    localStorage.setItem(FIREBASE_STORAGE_KEY, JSON.stringify(config));
    return { isReady: true, mode: 'firebase', projectId: config.projectId };
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
    isFirebaseReady = false;
    return { isReady: false, error: err.message, mode: 'error' };
  }
};

export const isConnectedToFirebase = () => isFirebaseReady && db !== null;

export const saveFirebaseConfig = (config) => {
  if (!config) {
    localStorage.removeItem(FIREBASE_STORAGE_KEY);
    isFirebaseReady = false;
    app = null;
    db = null;
    auth = null;
    return { isReady: false, mode: 'local' };
  }
  return initFirebase(config);
};

// Fetch bone metadata (merges Firestore overrides onto verified 115-mesh local schema)
export const fetchAllBones = async () => {
  if (isConnectedToFirebase()) {
    try {
      const snap = await getDocs(collection(db, 'canine_bones_v2'));
      if (!snap.empty) {
        const cloudById = {};
        snap.forEach((d) => {
          cloudById[d.id] = d.data();
        });
        return CANINE_BONES.map((baseBone) => ({
          ...baseBone,
          ...(cloudById[baseBone.id] || {}),
          meshes: baseBone.meshes,
          subPieces: baseBone.subPieces
        }));
      }
    } catch (err) {
      console.warn('Firestore read fallback to local dataset:', err);
    }
  }
  return CANINE_BONES;
};

// Study Notes
export const getLocalNotes = () => {
  try {
    const raw = localStorage.getItem(LOCAL_NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveBoneNote = async (boneId, noteText) => {
  const timestamp = new Date().toISOString();
  const localNotes = getLocalNotes();
  localNotes[boneId] = { text: noteText, updatedAt: timestamp };
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(localNotes));

  if (isConnectedToFirebase()) {
    try {
      const noteRef = doc(db, 'canine_user_notes', boneId);
      await setDoc(noteRef, { text: noteText, updatedAt: timestamp }, { merge: true });
    } catch (err) {
      console.warn('Failed to sync note to Firestore:', err);
    }
  }
  return localNotes[boneId];
};

// Bookmarks
export const getBookmarkedBones = () => {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleBookmarkBone = (boneId) => {
  const list = getBookmarkedBones();
  const updated = list.includes(boneId)
    ? list.filter((id) => id !== boneId)
    : [...list, boneId];
  localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
};

// Studied Progress ("ทำเครื่องหมายว่าเรียนแล้ว")
export const getStudiedBones = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STUDIED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleStudiedBone = async (boneId) => {
  const list = getStudiedBones();
  const updated = list.includes(boneId)
    ? list.filter((id) => id !== boneId)
    : [...list, boneId];
  localStorage.setItem(LOCAL_STUDIED_KEY, JSON.stringify(updated));

  if (isConnectedToFirebase()) {
    try {
      const progressRef = doc(db, 'canine_study_progress', 'default_student');
      await setDoc(
        progressRef,
        { studiedBoneIds: updated, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (err) {
      console.warn('Failed to sync study progress to Firestore:', err);
    }
  }
  return updated;
};

// One-click Firestore Seed for all 31 NAV structures (115 meshes) & orthopedic pathologies
export const seedFirestoreWithCanineData = async () => {
  if (!isConnectedToFirebase()) {
    throw new Error('ยังไม่ได้เชื่อมต่อ Firebase กรุณาวาง Firebase Config ก่อน');
  }

  let count = 0;
  for (const bone of CANINE_BONES) {
    const { subPieces, ...serializableBone } = bone;
    const cleanPayload = {
      ...serializableBone,
      subPieceCount: bone.meshes.length,
      subPieces: (subPieces || []).map(({ meshName, shortLabel, labelTh, labelEn, side }) => ({
        meshName,
        shortLabel,
        labelTh,
        labelEn,
        side
      }))
    };
    const boneRef = doc(db, 'canine_bones_v2', bone.id);
    await setDoc(boneRef, cleanPayload, { merge: true });
    count++;
  }

  for (const pathItem of VET_PATHOLOGIES) {
    const pathRef = doc(db, 'canine_pathologies', pathItem.id);
    await setDoc(pathRef, pathItem, { merge: true });
  }

  return { success: true, count, meshCount: 115 };
};

initFirebase();
