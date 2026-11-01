import React from 'react';
import {
  Search,
  Bone,
  Sparkles,
  Image as ImageIcon,
  Stethoscope,
  GraduationCap,
  Database,
  FileCode,
  Sun,
  Moon,
  Columns3
} from 'lucide-react';
import { TOTAL_MODELED_MESH_COUNT, CANINE_BONES } from '../../data/canineSkeletonData';

export default function Header({
  theme,
  onToggleTheme,
  cephalicCompareMode,
  onToggleCephalicCompareMode,
  onOpenSearch,
  onOpenJourneys,
  onOpenWikiGallery,
  onOpenPathologyModal,
  onOpenQuizModal,
  onOpenBlenderModal,
  onOpenFirebaseModal,
  isFirebaseActive,
  studiedCount = 0
}) {
  return (
    <header className="relative z-30 h-14 px-3 sm:px-5 chai-panel border-t-0 border-x-0 flex items-center justify-between gap-2">
      {/* Left Brand Identity (CHAi Canine Atlas Style) */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
          <Bone className="w-5 h-5 text-white" />
        </div>
        <div className="leading-tight truncate">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight chai-text-primary truncate">
              CHAi Canine Osteology Atlas
            </h1>
            <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600/10 text-blue-700 dark:text-sky-300 border border-blue-500/20">
              {CANINE_BONES.length} โครงสร้าง · {TOTAL_MODELED_MESH_COUNT} ชิ้นกระดูก 3D
            </span>
          </div>
          <p className="text-[11px] chai-text-secondary hidden sm:block truncate">
            กายวิภาคศาสตร์โครงกระดูกสุนัข 3 มิติ (<em>Canis lupus familiaris</em> · NAV Standard)
          </p>
        </div>
      </div>

      {/* Center Search Trigger (/ Shortcut) */}
      <button
        onClick={onOpenSearch}
        className="flex-1 max-w-md mx-1 px-3 py-1.5 rounded-xl chai-card hover:border-blue-500/50 transition-all flex items-center justify-between gap-2 text-xs chai-text-secondary group"
        title="กดปุ่ม / เพื่อค้นหากระดูกทันที"
      >
        <span className="flex items-center gap-2 truncate">
          <Search className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
          <span className="truncate">
            ค้นหากระดูก ปล้องสันหลัง ซี่โครง หรือชื่อละติน...
          </span>
        </span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200/80 dark:bg-slate-800 chai-text-primary border border-slate-300/60 dark:border-slate-700 shrink-0">
          /
        </kbd>
      </button>

      {/* Right Clinical & Study Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
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
          <span className="hidden md:inline">กะโหลก 3 ประเภท</span>
        </button>

        {/* Connected Journeys */}
        <button
          onClick={onOpenJourneys}
          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
          title="บทเรียนเชื่อมโยง 3 มิติ (Connected Journeys)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">บทเรียนเชื่อมโยง</span>
        </button>

        {/* Wikimedia X-Ray & Plates Gallery */}
        <button
          onClick={onOpenWikiGallery}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium chai-card hover:border-blue-500/40 flex items-center gap-1.5 transition-all"
          title="คลังภาพเอกซเรย์และแผนภาพอ้างอิง Wikimedia Commons"
        >
          <ImageIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden md:inline">ภาพเอกซเรย์ & Wiki</span>
        </button>

        {/* Orthopedic Pathologies */}
        <button
          onClick={onOpenPathologyModal}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium chai-card hover:border-rose-500/40 flex items-center gap-1.5 transition-all"
          title="โรคกระดูกและข้อสุนัขทางคลินิก"
        >
          <Stethoscope className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span className="hidden xl:inline">โรคกระดูก</span>
        </button>

        {/* Quiz */}
        <button
          onClick={onOpenQuizModal}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium chai-card hover:border-amber-500/40 flex items-center gap-1.5 transition-all"
          title="แบบทดสอบกายวิภาคกระดูกสุนัข"
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden xl:inline">ทดสอบ ({studiedCount}/{CANINE_BONES.length})</span>
        </button>

        {/* Blender Guide */}
        <button
          onClick={onOpenBlenderModal}
          className="p-2 rounded-xl chai-card hover:border-blue-500/40 transition-all hidden sm:flex items-center justify-center"
          title="คู่มือนำเข้าโมเดล .GLB จากโปรแกรม Blender"
        >
          <FileCode className="w-3.5 h-3.5 chai-text-secondary" />
        </button>

        {/* Firebase Cloud Status */}
        <button
          onClick={onOpenFirebaseModal}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
            isFirebaseActive
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'chai-card hover:border-amber-500/40'
          }`}
          title="ตั้งค่าการเชื่อมต่อฐานข้อมูล Firebase Firestore"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden 2xl:inline">
            {isFirebaseActive ? 'Firebase เชื่อมต่อแล้ว' : 'Firebase'}
          </span>
        </button>

        {/* Clinical Light / Radiology Dark Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl chai-card hover:border-blue-500/40 transition-all flex items-center justify-center"
          title={theme === 'light' ? 'สลับเป็นโหมดห้องฟิล์มมืด (Radiology Dark)' : 'สลับเป็นโหมดคลินิกสว่าง (CHAi Light)'}
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5 text-slate-700" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-300" />
          )}
        </button>
      </div>
    </header>
  );
}
