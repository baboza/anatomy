import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Key,
  Trash2
} from 'lucide-react';
import {
  getActiveFirebaseConfig,
  saveFirebaseConfig,
  isConnectedToFirebase,
  seedFirestoreWithCanineData
} from '../../services/firebase';

export default function FirebaseModal({ isOpen, onClose, onConfigUpdated }) {
  const [configJson, setConfigJson] = useState('');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [isSeeding, setIsSeeding] = useState(false);
  const isConnected = isConnectedToFirebase();

  useEffect(() => {
    if (isOpen) {
      const active = getActiveFirebaseConfig();
      setConfigJson(active ? JSON.stringify(active, null, 2) : '');
      setStatusMessage({ text: '', type: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    try {
      if (!configJson.trim()) {
        saveFirebaseConfig(null);
        setStatusMessage({ text: 'สลับเป็นโหมดออฟไลน์ (บันทึกผ่าน LocalStorage)', type: 'info' });
        if (onConfigUpdated) onConfigUpdated(false);
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(configJson);
      } catch {
        const sanitized = configJson
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
          .replace(/'/g, '"');
        parsed = JSON.parse(sanitized);
      }

      if (!parsed.apiKey || !parsed.projectId) {
        throw new Error('กรุณาระบุอย่างน้อย apiKey และ projectId');
      }

      const res = saveFirebaseConfig(parsed);
      if (res.isReady) {
        setStatusMessage({
          text: `เชื่อมต่อ Firebase สำเร็จ! โปรเจกต์: ${parsed.projectId}`,
          type: 'success'
        });
        if (onConfigUpdated) onConfigUpdated(true);
      } else {
        setStatusMessage({
          text: `เชื่อมต่อล้มเหลว: ${res.error || 'กรุณาตรวจสอบข้อมูล'}`,
          type: 'error'
        });
      }
    } catch (err) {
      setStatusMessage({ text: `รูปแบบข้อมูลไม่ถูกต้อง: ${err.message}`, type: 'error' });
    }
  };

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await seedFirestoreWithCanineData();
      setStatusMessage({
        text: `อัปโหลดข้อมูลโครงสร้างกระดูกสุนัข ${res.count} หมวด (${res.meshCount} ชิ้นย่อย) เข้าสู่ Firestore สำเร็จ!`,
        type: 'success'
      });
    } catch (err) {
      setStatusMessage({
        text: `เกิดข้อผิดพลาดในการ Seed ข้อมูล: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl chai-panel overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold chai-text-primary">
                เชื่อมต่อฐานข้อมูล Firebase Firestore
              </h2>
              <p className="text-[11px] chai-text-secondary">
                สามารถนำ Firebase Config มาวางเมื่อพร้อม (ขณะนี้ทำงานได้ครบ 100% แบบออฟไลน์)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 chai-text-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-2.5 border-b border-slate-200/60 dark:border-slate-800 flex items-center gap-2 text-xs">
          <span className="chai-text-secondary">สถานะปัจจุบัน:</span>
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>เชื่อมต่อกับ Cloud Firestore แล้ว</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>โหมด Offline (บันทึกโน้ตและความก้าวหน้าใน LocalStorage)</span>
            </span>
          )}
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block chai-text-primary font-bold mb-1.5 flex items-center justify-between">
              <span>วาง Firebase Configuration (JSON หรือ JS Object):</span>
              <span className="text-[11px] text-blue-600 dark:text-sky-400 font-normal">
                Firebase Console &gt; Project Settings
              </span>
            </label>
            <textarea
              rows={7}
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "your-project.firebaseapp.com",\n  "projectId": "your-project-id",\n  "storageBucket": "your-project.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
              className="w-full rounded-xl p-3 chai-card font-mono text-[11px] chai-text-primary focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {statusMessage.text && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/12 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-500/12 border-rose-500/40 text-rose-800 dark:text-rose-200'
                  : 'chai-card chai-text-primary'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={handleSaveConfig}
              className="w-full sm:flex-1 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Key className="w-4 h-4" />
              <span>บันทึกการตั้งค่า Firebase</span>
            </button>

            {isConnected && (
              <button
                onClick={handleSeedData}
                disabled={isSeeding}
                className="w-full sm:w-auto py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isSeeding ? 'กำลังอัปโหลด...' : 'Seed 31 โครงสร้างเข้า Firestore'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setConfigJson('');
                saveFirebaseConfig(null);
                setStatusMessage({ text: 'ล้างการตั้งค่า กลับสู่โหมดออฟไลน์', type: 'info' });
                if (onConfigUpdated) onConfigUpdated(false);
              }}
              className="w-full sm:w-auto py-2 px-3 rounded-xl chai-card hover:border-rose-500/40 chai-text-secondary"
              title="ล้างการตั้งค่า"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
