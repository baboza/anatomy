import React, { useState } from 'react';
import {
  Bone,
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
  ChevronRight,
  ShieldCheck
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
  const [authMethod, setAuthMethod] = useState('google'); // 'google' | 'email'
  const [emailMode, setEmailMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-xl shadow-blue-500/25 animate-pulse">
            <Bone className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -inset-1 rounded-3xl bg-blue-500/20 blur-md -z-10 animate-pulse" />
        </div>
        <div className="text-sm font-bold chai-text-primary mt-5">
          กำลังเตรียมความพร้อมระบบ 3 มิติ...
        </div>
        <div className="text-xs chai-text-secondary mt-1">
          CHAi Canine Osteology 3D Atlas
        </div>
      </div>
    );
  }

  // Account Suspended or Maintenance Lock
  if (suspendedUser || maintenanceBlockedUser) {
    const isMaintenance = Boolean(maintenanceBlockedUser && !suspendedUser);
    const blockedEmail = suspendedUser?.email || maintenanceBlockedUser?.email;
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full rounded-3xl chai-panel p-8 space-y-5 text-center shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold chai-text-primary">
              {isMaintenance ? 'ระบบอยู่ในโหมดปิดปรับปรุงชั่วคราว' : 'บัญชีนี้ถูกระงับสิทธิ์ชั่วคราว'}
            </h2>
            <p className="text-xs chai-text-secondary mt-1.5 leading-relaxed">
              บัญชี <strong>{blockedEmail}</strong>{' '}
              {isMaintenance
                ? 'ระบบกำลังปรับปรุงข้อมูลสแกน 3 มิติ กรุณารอสักครู่'
                : 'ไม่สามารถเข้าใช้งานได้ กรุณาติดต่อผู้ดูแลระบบ'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>สลับบัญชีอื่น</span>
          </button>
        </div>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setErrorMsg(translateAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('กรุณากรอกอีเมล');
      return;
    }

    setSubmitting(true);
    try {
      if (emailMode === 'reset') {
        await sendPasswordReset(email);
        setSuccessMsg('ส่งลิงก์ตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณเรียบร้อยแล้ว');
      } else if (emailMode === 'register') {
        if (password.length < 6) {
          setErrorMsg('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
          setSubmitting(false);
          return;
        }
        await registerWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setErrorMsg(translateAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      {/* Top Bar: Minimal Theme Toggle */}
      <div className="w-full max-w-md flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bone className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-extrabold tracking-tight chai-text-primary">
            CHAi <span className="text-blue-600 dark:text-sky-400">Canine Atlas</span>
          </span>
        </div>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl chai-card hover:border-blue-500/40 text-xs font-medium chai-text-secondary flex items-center gap-1.5 transition"
          title="สลับโหมดสี Light / Dark"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto py-4 animate-fade-in">
        <div className="rounded-3xl chai-panel p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Ambient Decorative Glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-1.5 mb-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-sky-300 text-[11px] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>3D Canine Osteology Platform</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black chai-text-primary tracking-tight">
              เข้าสู่ระบบเพื่อเริ่มใช้งาน
            </h1>
            <p className="text-xs chai-text-secondary">
              กายวิภาคศาสตร์โครงกระดูกสุนัข 3 มิติ (115 ชิ้นกระดูก)
            </p>
          </div>

          {/* Quick Feature Highlights Pills */}
          <div className="grid grid-cols-3 gap-2 mb-6 text-center text-[11px] font-semibold relative z-10">
            <div className="p-2 rounded-xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800">
              <span className="block font-bold text-blue-600 dark:text-sky-400">115 ชิ้น</span>
              <span className="text-[10px] chai-text-secondary">โครงกระดูก 3D</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800">
              <span className="block font-bold text-amber-600 dark:text-amber-400">3 รูปแบบ</span>
              <span className="text-[10px] chai-text-secondary">กะโหลกสุนัข</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800">
              <span className="block font-bold text-emerald-600 dark:text-emerald-400">ไม้บรรทัด</span>
              <span className="text-[10px] chai-text-secondary">วัดระยะและมุม 3D</span>
            </div>
          </div>

          {/* Primary Action: Google 1-Click Sign-In */}
          <div className="space-y-4 relative z-10">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-slate-700 shadow-md shadow-slate-200/50 dark:shadow-none flex items-center justify-center gap-3 text-sm font-bold chai-text-primary transition-all disabled:opacity-60 group"
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
                {submitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
              <button
                type="button"
                onClick={() => {
                  setAuthMethod(authMethod === 'email' ? 'google' : 'email');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="absolute px-3 bg-white dark:bg-slate-900 text-[11px] font-semibold text-blue-600 dark:text-sky-400 hover:underline"
              >
                {authMethod === 'email' ? 'ซ่อนฟอร์มอีเมล' : 'หรือใช้อีเมลและรหัสผ่าน'}
              </button>
            </div>

            {/* Email & Password Collapsible Form */}
            {authMethod === 'email' && (
              <div className="space-y-3 pt-2 animate-fade-in">
                {/* Mode Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailMode('login');
                      setErrorMsg('');
                    }}
                    className={`py-1 rounded-lg transition ${
                      emailMode === 'login'
                        ? 'bg-white dark:bg-slate-900 chai-text-primary shadow-sm'
                        : 'chai-text-secondary'
                    }`}
                  >
                    เข้าสู่ระบบ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailMode('register');
                      setErrorMsg('');
                    }}
                    className={`py-1 rounded-lg transition ${
                      emailMode === 'register'
                        ? 'bg-white dark:bg-slate-900 chai-text-primary shadow-sm'
                        : 'chai-text-secondary'
                    }`}
                  >
                    สมัครสมาชิก
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailMode('reset');
                      setErrorMsg('');
                    }}
                    className={`py-1 rounded-lg transition ${
                      emailMode === 'reset'
                        ? 'bg-white dark:bg-slate-900 chai-text-primary shadow-sm'
                        : 'chai-text-secondary'
                    }`}
                  >
                    ลืมรหัสผ่าน
                  </button>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-2.5 text-xs">
                  {emailMode === 'register' && (
                    <div>
                      <label className="block font-semibold chai-text-primary mb-1">
                        ชื่อ-นามสกุล หรือชื่อแสดง
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 chai-text-muted absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="เช่น อ.ดร.จิรวัฒน์"
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
                        placeholder="your-email@msu.ac.th"
                        className="w-full pl-9 pr-3 py-2 rounded-xl chai-card chai-text-primary focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {emailMode !== 'reset' && (
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
                    {emailMode === 'login' && <LogIn className="w-4 h-4" />}
                    {emailMode === 'register' && <UserPlus className="w-4 h-4" />}
                    {emailMode === 'reset' && <KeyRound className="w-4 h-4" />}
                    <span>
                      {submitting
                        ? 'กำลังดำเนินการ...'
                        : emailMode === 'login'
                        ? 'เข้าสู่ระบบด้วยอีเมล'
                        : emailMode === 'register'
                        ? 'สร้างบัญชีเข้าใช้งาน'
                        : 'ส่งลิงก์ตั้งรหัสผ่านใหม่'}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clean Bottom Footer */}
      <div className="w-full max-w-md text-center py-2 text-[11px] chai-text-secondary">
        คณะสัตวแพทยศาสตร์ มหาวิทยาลัยมหาสารคาม
        <span className="mx-1.5 opacity-40">·</span>
        NAV Standard
      </div>
    </div>
  );
}
