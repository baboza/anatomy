import React from 'react';
import {
  Search,
  Bone,
  Sparkles,
  Image as ImageIcon,
  Stethoscope,
  GraduationCap,
  Sun,
  Moon,
  Columns3,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { TOTAL_MODELED_MESH_COUNT, CANINE_BONES } from '../../data/canineSkeletonData';

export default function Header({
  theme,
  onToggleTheme,
  portalSettings = {},
  currentUser = null,
  onOpenAdminModal,
  onLogout,
  cephalicCompareMode,
  onToggleCephalicCompareMode,
  onOpenSearch,
  onOpenJourneys,
  onOpenWikiGallery,
  onOpenPathologyModal,
  onOpenQuizModal,
  studiedCount = 0
}) {
  const titleText = portalSettings?.portalTitle || 'CHAi Canine Osteology Atlas';
  const subtitleText =
    portalSettings?.institutionName ||
    'กายวิภาคศาสตร์โครงกระดูกสุนัข 3 มิติ (Canis lupus familiaris · NAV Standard)';

  return (
    <header className="relative z-30 h-14 px-3 sm:px-5 chai-panel border-t-0 border-x-0 flex items-center justify-between gap-2">
      {/* Left Brand Identity */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
          <Bone className="w-5 h-5 text-white" />
        </div>
        <div className="leading-tight truncate">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight chai-text-primary truncate">
              {titleText}
            </h1>
            <span className="hidden 2xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600/10 text-blue-700 dark:text-sky-300 border border-blue-500/20">
              {CANINE_BONES.length} โครงสร้าง · {TOTAL_MODELED_MESH_COUNT} ชิ้น 3D
            </span>
          </div>
          <p className="text-[11px] chai-text-secondary hidden sm:block truncate">{subtitleText}</p>
        </div>
      </div>

      {/* Center Search Trigger (/ Shortcut) */}
      <button
        onClick={onOpenSearch}
        className="flex-1 max-w-sm mx-1 px-3 py-1.5 rounded-xl chai-card hover:border-blue-500/50 transition-all flex items-center justify-between gap-2 text-xs chai-text-secondary group"
        title="กดปุ่ม / เพื่อค้นหากระดูกทันที"
      >
        <span className="flex items-center gap-2 truncate">
          <Search className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
          <span className="truncate">ค้นหากระดูก ปล้องสันหลัง ซี่โครง หรือชื่อละติน...</span>
        </span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200/80 dark:bg-slate-800 chai-text-primary border border-slate-300/60 dark:border-slate-700 shrink-0">
          /
        </kbd>
      </button>

      {/* Right Clinical, Study & User/Admin Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Admin Management Studio Button (Visible ONLY to Admin e.g. jirawat.s@msu.ac.th) */}
        {currentUser?.isAdmin && (
          <button
            onClick={onOpenAdminModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-sm flex items-center gap-1.5 transition-all"
            title="ศูนย์จัดการข้อมูลผู้ดูแลระบบ (Admin Management Studio)"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">จัดการข้อมูล Admin</span>
          </button>
        )}

        {/* 3 Cephalic Skull Types Lab Button */}
        <button
          onClick={onToggleCephalicCompareMode}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
            cephalicCompareMode
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
              : 'bg-indigo-600/12 border-indigo-500/35 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600/20'
          }`}
          title="เปรียบเทียบกะโหลกสุนัขทั้ง 3 ประเภท: Brachycephalic · Mesocephalic · Dolichocephalic"
        >
          <Columns3 className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">กะโหลก 3 ประเภท</span>
        </button>

        {/* Connected Journeys */}
        <button
          onClick={onOpenJourneys}
          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
          title="บทเรียนเชื่อมโยง 3 มิติ (Connected Journeys)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">บทเรียน</span>
        </button>

        {/* Wikimedia X-Ray & Plates Gallery */}
        <button
          onClick={onOpenWikiGallery}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium chai-card hover:border-blue-500/40 flex items-center gap-1.5 transition-all"
          title="คลังภาพเอกซเรย์และแผนภาพอ้างอิง Wikimedia Commons"
        >
          <ImageIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden xl:inline">เอกซเรย์ & Wiki</span>
        </button>

        {/* Orthopedic Pathologies */}
        <button
          onClick={onOpenPathologyModal}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium chai-card hover:border-rose-500/40 flex items-center gap-1.5 transition-all"
          title="โรคกระดูกและข้อสุนัขทางคลินิก"
        >
          <Stethoscope className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span className="hidden 2xl:inline">โรคกระดูก</span>
        </button>

        {/* Quiz */}
        <button
          onClick={onOpenQuizModal}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium chai-card hover:border-amber-500/40 flex items-center gap-1.5 transition-all"
          title="แบบทดสอบกายวิภาคกระดูกสุนัข"
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden 2xl:inline">ทดสอบ ({studiedCount}/{CANINE_BONES.length})</span>
        </button>



        {/* Clinical Light / Radiology Dark Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl chai-card hover:border-blue-500/40 transition-all flex items-center justify-center"
          title={
            theme === 'light'
              ? 'สลับเป็นโหมดห้องฟิล์มมืด (Radiology Dark)'
              : 'สลับเป็นโหมดคลินิกสว่าง (CHAi Light)'
          }
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5 text-slate-700" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-300" />
          )}
        </button>

        {/* Signed-in User Badge & Logout */}
        {currentUser && (
          <div className="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-800">
            <div
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-xl chai-card max-w-[165px]"
              title={`${currentUser.displayName} (${currentUser.email})`}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {(currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="truncate leading-none">
                <div className="text-[10px] font-bold chai-text-primary truncate">
                  {currentUser.displayName || currentUser.email.split('@')[0]}
                </div>
                <div className="text-[9px] chai-text-muted truncate">
                  {currentUser.isAdmin ? 'Admin' : 'Member'}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl chai-card hover:border-rose-500/50 hover:text-rose-600 dark:hover:text-rose-400 chai-text-secondary transition-all"
              title={`ออกจากระบบ (${currentUser.email})`}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
