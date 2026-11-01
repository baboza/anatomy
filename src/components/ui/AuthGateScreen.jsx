import React, { useState } from 'react';
import {
  Bone,
  ShieldCheck,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  ExternalLink
} from 'lucide-react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  sendPasswordReset,
  translateAuthError,
  PRIMARY_ADMIN_EMAIL
} from '../../services/firebase';

export default function AuthGateScreen({
  theme = 'light',
  onToggleTheme,
  authLoading = false,
  suspendedUser = null,
  maintenanceBlockedUser = null,
  onLogout
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showProviderConsoleHint, setShowProviderConsoleHint] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-950 transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/30 animate-pulse mb-4">
          <Bone className="w-7 h-7 text-white" />
        </div>
        <div className="text-sm font-bold chai-text-primary">
          กำลังตรวจสอบสถานะการเข้าสู่ระบบ...
        </div>
        <div className="text-xs chai-text-secondary mt-1">
          CHAi Canine Osteology 3D Atlas · anatomy-568be
        </div>
      </div>
    );
  }

  // Case: Suspended account or Maintenance mode lock for non-admin
  if (suspendedUser || maintenanceBlockedUser) {
    const blockedProfile = suspendedUser || maintenanceBlockedUser;
    const isMaintenance = Boolean(maintenanceBlockedUser && !suspendedUser);
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950">
        <div className="max-w-md w-full rounded-2xl chai-panel p-6 space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/30">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-extrabold chai-text-primary">
            {isMaintenance
              ? 'ระบบกำลังอยู่ในโหมดปิดปรับปรุงชั่วคราว'
              : 'บัญชีผู้ใช้งานนี้ถูกระงับสิทธิ์ชั่วคราว'}
          </h2>
          <p className="text-xs chai-text-secondary leading-relaxed">
            บัญชี <strong className="chai-text-primary">{blockedProfile.email}</strong>{' '}
            {isMaintenance
              ? 'ยังไม่สามารถเข้าใช้งานได้ในขณะนี้ เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าจัดการข้อมูลได้'
              : 'ถูกระงับการใช้งานโดยผู้ดูแลระบบ กรุณาติดต่อผู้ดูแลระบบหลักหากต้องการเปิดสิทธิ์อีกครั้ง'}
          </p>
          <div className="p-3 rounded-xl chai-card text-xs chai-text-secondary">
            ผู้ดูแลระบบหลัก: <strong className="chai-text-primary">{PRIMARY_ADMIN_EMAIL}</strong>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ / สลับบัญชีอื่น</span>
          </button>
        </div>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setShowProviderConsoleHint(false);
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err?.code === 'auth/operation-not-allowed') {
        setShowProviderConsoleHint(true);
      }
      setErrorMsg(translateAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setShowProviderConsoleHint(false);

    if (!email.trim()) {
      setErrorMsg('กรุณากรอกอีเมลของคุณ');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'reset') {
        await sendPasswordReset(email);
        setSuccessMsg('ส่งลิงก์ตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณเรียบร้อยแล้ว กรุณาตรวจสอบกล่องจดหมาย');
      } else if (mode === 'register') {
        if (password.length < 6) {
          setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
          setSubmitting(false);
          return;
        }
        await registerWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      if (err?.code === 'auth/operation-not-allowed') {
        setShowProviderConsoleHint(true);
      }
      setErrorMsg(translateAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-blue-50/60 to-indigo-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40">
      {/* Top-right Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="fixed top-4 right-4 z-20 p-2.5 rounded-xl chai-panel hover:border-blue-500/40 transition flex items-center gap-1.5 text-xs font-semibold chai-text-primary"
        title="สลับโหมดสีหน้าจอ"
      >
        {theme === 'light' ? (
          <>
            <Moon className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Light</span>
          </>
        )}
      </button>

      <div className="w-full max-w-4xl rounded-3xl chai-panel overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl border border-slate-200/80 dark:border-slate-800">
        {/* Left Clinical Showcase Column */}
        <div className="lg:col-span-6 p-6 sm:p-8 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Veterinary Osteology 3D Platform · NAV Standard</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center shrink-0">
                <Bone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  CHAi Canine Osteology Atlas
                </h1>
                <p className="text-xs text-blue-100/90">
                  ระบบกายวิภาคศาสตร์โครงกระดูกสุนัข 3 มิติ (<em>Canis lupus familiaris</em>)
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              สำรวจโครงกระดูกสุนัขสแกนความละเอียดสูงครบทั้ง <strong>31 หมวด (115 ชิ้นกระดูก 3 มิติ)</strong>{' '}
              พร้อมห้องปฏิบัติการเปรียบเทียบกะโหลกสุนัขทั้ง <strong>3 ประเภท (Brachycephalic, Mesocephalic, Dolichocephalic)</strong>{' '}
              และฟิล์มเอกซเรย์ทางคลินิกสัตวแพทย์
            </p>

            {/* Preview Thumbnail Strip */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                <div className="text-lg font-extrabold text-white">115</div>
                <div className="text-[11px] text-blue-100/85">ชิ้นกระดูกแยกอิสระ 360°</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                <div className="text-lg font-extrabold text-amber-300">3 Types</div>
                <div className="text-[11px] text-blue-100/85">กะโหลกสั้น · กลาง · ยาว</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                <div className="text-lg font-extrabold text-emerald-300">Cloud</div>
                <div className="text-[11px] text-blue-100/85">ซิงก์โน้ตและความก้าวหน้า</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-blue-100/85">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Admin ระบบ: <strong>{PRIMARY_ADMIN_EMAIL}</strong></span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/25 border border-white/15 w-fit">
              Host: anatomy-568be
            </span>
          </div>
        </div>

        {/* Right Authentication Form Column */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center space-y-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold chai-text-primary">
              เข้าสู่ระบบเพื่อใช้งาน Atlas 3 มิติ
            </h2>
            <p className="text-xs chai-text-secondary mt-1">
              รองรับบัญชีมหาวิทยาลัย <strong>@msu.ac.th</strong> และบัญชี Google ทั่วไป (หากเข้าสู่ระบบด้วย{' '}
              <span className="font-semibold text-blue-600 dark:text-sky-400">{PRIMARY_ADMIN_EMAIL}</span>{' '}
              จะได้รับสิทธิ์ <strong>Admin</strong> สูงสุดโดยอัตโนมัติ)
            </p>
          </div>

          {/* Primary Recommended: 1-Click Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-blue-500/40 hover:border-blue-500 shadow-md shadow-blue-500/10 flex items-center justify-center gap-3 text-sm font-bold text-slate-900 dark:text-white transition-all disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            <span>
              {submitting ? 'กำลังเชื่อมต่อบัญชี...' : 'เข้าสู่ระบบด้วย Google (@msu.ac.th / Gmail)'}
            </span>
          </button>

          {/* Divider / Toggle Email Form */}
          <div className="relative flex items-center py-0.5">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <button
              type="button"
              onClick={() => {
                setShowEmailForm((v) => !v);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="mx-3 text-[11px] font-semibold text-blue-600 dark:text-sky-400 hover:underline"
            >
              {showEmailForm ? 'ซ่อนฟอร์มอีเมลและรหัสผ่าน' : 'หรือเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน'}
            </button>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* Optional Email & Password Form */}
          {showEmailForm && (
            <div className="space-y-3 animate-fade-in">
              {/* Sub-mode Switcher */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`py-1.5 rounded-lg transition ${
                    mode === 'login'
                      ? 'bg-white dark:bg-slate-800 chai-text-primary shadow-sm'
                      : 'chai-text-secondary'
                  }`}
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`py-1.5 rounded-lg transition ${
                    mode === 'register'
                      ? 'bg-white dark:bg-slate-800 chai-text-primary shadow-sm'
                      : 'chai-text-secondary'
                  }`}
                >
                  สมัครสมาชิก
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`py-1.5 rounded-lg transition ${
                    mode === 'reset'
                      ? 'bg-white dark:bg-slate-800 chai-text-primary shadow-sm'
                      : 'chai-text-secondary'
                  }`}
                >
                  ลืมรหัสผ่าน
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-2.5 text-xs">
                {mode === 'register' && (
                  <div>
                    <label className="block font-semibold chai-text-primary mb-1">
                      ชื่อ-นามสกุล / ชื่อที่แสดง
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 chai-text-muted absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="เช่น อ.ดร.จิรวัฒน์ หรือ นิสิตสัตวแพทย์"
                        className="w-full pl-9 pr-3 py-2 rounded-xl chai-card chai-text-primary focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold chai-text-primary mb-1">อีเมล</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 chai-text-muted absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jirawat.s@msu.ac.th"
                      className="w-full pl-9 pr-3 py-2 rounded-xl chai-card chai-text-primary focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {mode !== 'reset' && (
                  <div>
                    <label className="block font-semibold chai-text-primary mb-1">รหัสผ่าน</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 chai-text-muted absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="อย่างน้อย 6 ตัวอักษร"
                        className="w-full pl-9 pr-3 py-2 rounded-xl chai-card chai-text-primary focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-60"
                >
                  {mode === 'login' && <LogIn className="w-4 h-4" />}
                  {mode === 'register' && <UserPlus className="w-4 h-4" />}
                  {mode === 'reset' && <KeyRound className="w-4 h-4" />}
                  <span>
                    {submitting
                      ? 'กำลังดำเนินการ...'
                      : mode === 'login'
                      ? 'เข้าสู่ระบบด้วยอีเมล'
                      : mode === 'register'
                      ? 'สร้างบัญชีเข้าใช้งาน'
                      : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Error / Success Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/12 border border-rose-500/35 text-xs text-rose-800 dark:text-rose-200 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
              {showProviderConsoleHint && (
                <a
                  href="https://console.firebase.google.com/project/anatomy-568be/authentication/providers"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-blue-700 dark:text-sky-300 hover:underline"
                >
                  <span>เปิดตั้งค่า Sign-in Providers ใน Firebase Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/12 border border-emerald-500/35 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px] chai-text-muted flex items-center justify-between gap-2">
            <span>ปลอดภัยด้วย Firebase Authentication (Spark Free Tier)</span>
            <span>Canis lupus familiaris 3D</span>
          </div>
        </div>
      </div>
    </div>
  );
}
