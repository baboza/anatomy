import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Layers,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  Scissors,
  RotateCcw,
  Star
} from 'lucide-react';
import {
  SKELETON_HIERARCHY,
  BONE_BY_ID,
  CANINE_BONES,
  TOTAL_MODELED_MESH_COUNT
} from '../../data/canineSkeletonData';

export default function AnatomyHierarchyTree({
  bones = CANINE_BONES,
  selectedBoneId,
  onSelectBone,
  hiddenBoneIds = [],
  onToggleHideBone,
  onShowAllBones,
  studiedBoneIds = [],
  bookmarkedBoneIds = [],
  clippingConfig,
  onChangeClippingConfig,
  isOpen,
  onToggleOpen
}) {
  const liveBoneMap = React.useMemo(
    () => (bones?.length ? Object.fromEntries(bones.map((b) => [b.id, b])) : BONE_BY_ID),
    [bones]
  );
  const [expandedGroups, setExpandedGroups] = useState({
    axial_head: true,
    axial_spine: true,
    axial_thorax: true,
    appendicular_fore: true,
    appendicular_hind: true,
    visceral_skeleton: true
  });
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'axial' | 'fore' | 'hind' | 'starred'
  const [isClipSectionOpen, setIsClipSectionOpen] = useState(false);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="absolute top-3 left-3 z-20 px-3 py-2 rounded-xl chai-panel hover:border-blue-500/50 flex items-center gap-2 text-xs font-semibold transition-all"
        title="เปิดสารบัญโครงสร้างกระดูกสุนัข"
      >
        <PanelLeftOpen className="w-4 h-4 text-blue-600 dark:text-sky-400" />
        <span>สารบัญกระดูก ({TOTAL_MODELED_MESH_COUNT} ชิ้น)</span>
      </button>
    );
  }

  const progressPct = Math.round((studiedBoneIds.length / CANINE_BONES.length) * 100);

  // Axis bounds for clipping plane slider
  const axisRange =
    clippingConfig.axis === 'x'
      ? { min: -0.45, max: 0.45, label: 'แนวแบ่งซ้าย-ขวา (Sagittal)' }
      : clippingConfig.axis === 'y'
      ? { min: -1.1, max: 1.25, label: 'แนวบน-ล่าง (Dorsal)' }
      : { min: -1.65, max: 1.45, label: 'แนวหัว-ท้าย (Transverse)' };

  return (
    <aside className="absolute top-3 left-3 bottom-20 z-20 w-72 sm:w-80 rounded-2xl chai-panel flex flex-col overflow-hidden animate-fade-in">
      {/* Header & Study Progress */}
      <div className="p-3.5 border-b border-slate-200/70 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span className="text-xs font-extrabold tracking-tight chai-text-primary">
              ระบบโครงกระดูกสุนัข ({CANINE_BONES.length})
            </span>
          </div>
          <div className="flex items-center gap-1">
            {hiddenBoneIds.length > 0 && (
              <button
                onClick={onShowAllBones}
                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition"
                title="แสดงกระดูกที่ซ่อนไว้ทั้งหมด"
              >
                แสดงครบ ({hiddenBoneIds.length} ซ่อน)
              </button>
            )}
            <button
              onClick={onToggleOpen}
              className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 chai-text-secondary"
              title="ย่อแถบสารบัญ"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Study Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="chai-text-secondary">ความก้าวหน้าการเรียน</span>
            <span className="font-bold text-blue-600 dark:text-sky-400">
              {studiedBoneIds.length}/{CANINE_BONES.length} ({progressPct}%)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px]">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'axial', label: 'แกนกลาง' },
            { id: 'fore', label: 'ขาหน้า' },
            { id: 'hind', label: 'ขาหลัง' },
            { id: 'starred', label: '★ ปักหมุด' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'chai-card hover:border-blue-500/40 chai-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Hierarchy Tree */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 text-xs">
        {SKELETON_HIERARCHY.map((group) => {
          const bonesInGroup = group.boneIds
            .map((id) => liveBoneMap[id])
            .filter(Boolean)
            .filter((bone) => {
              if (filterTab === 'axial') return bone.category === 'axial' || bone.category === 'visceral';
              if (filterTab === 'fore') return bone.category === 'appendicular_fore';
              if (filterTab === 'hind') return bone.category === 'appendicular_hind';
              if (filterTab === 'starred') return bookmarkedBoneIds.includes(bone.id);
              return true;
            });

          if (bonesInGroup.length === 0) return null;

          const isExpanded = expandedGroups[group.id] !== false;
          const meshCountInGroup = bonesInGroup.reduce((acc, b) => acc + b.meshes.length, 0);

          return (
            <div key={group.id} className="rounded-xl chai-card overflow-hidden">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full px-2.5 py-2 flex items-center justify-between gap-2 hover:bg-blue-500/5 transition text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 chai-text-secondary shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 chai-text-secondary shrink-0" />
                  )}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: group.badgeColor }}
                  />
                  <div className="truncate">
                    <div className="font-bold chai-text-primary truncate">{group.nameTh}</div>
                    <div className="text-[10px] chai-text-muted truncate">{group.nameLatin}</div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-200/70 dark:bg-slate-800 chai-text-secondary shrink-0">
                  {meshCountInGroup} ชิ้น
                </span>
              </button>

              {isExpanded && (
                <div className="px-1.5 pb-1.5 space-y-0.5 border-t border-slate-200/50 dark:border-slate-800/70 pt-1">
                  {bonesInGroup.map((bone) => {
                    const isSelected = selectedBoneId === bone.id;
                    const isHidden = hiddenBoneIds.includes(bone.id);
                    const isStudied = studiedBoneIds.includes(bone.id);
                    const isStarred = bookmarkedBoneIds.includes(bone.id);

                    return (
                      <div
                        key={bone.id}
                        className={`group flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'hover:bg-blue-600/8 chai-text-primary'
                        } ${isHidden ? 'opacity-45' : ''}`}
                        onClick={() => onSelectBone(bone.id, null)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: isSelected ? '#fde047' : bone.color }}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold truncate flex items-center gap-1">
                              <span className="truncate">{bone.nameTh}</span>
                              {isStarred && (
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                              )}
                              {isStudied && (
                                <CheckCircle2
                                  className={`w-3 h-3 shrink-0 ${
                                    isSelected ? 'text-emerald-200' : 'text-emerald-500'
                                  }`}
                                />
                              )}
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-blue-100' : 'chai-text-muted'
                              }`}
                            >
                              {bone.nameLatin.split(' (')[0]}
                              {bone.meshes.length > 1 ? ` · ${bone.meshes.length} ชิ้น` : ''}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleHideBone(bone.id);
                          }}
                          className={`p-1 rounded-md transition ${
                            isSelected
                              ? 'text-white/85 hover:bg-white/20'
                              : isHidden
                              ? 'text-rose-500 bg-rose-500/10'
                              : 'opacity-0 group-hover:opacity-100 chai-text-secondary hover:bg-slate-200/70 dark:hover:bg-slate-800'
                          }`}
                          title={isHidden ? 'แสดงชิ้นกระดูกนี้' : 'ซ่อนชิ้นกระดูกนี้ชั่วคราว'}
                        >
                          {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Interactive 3D Cross-Section Clipping Slicer */}
      <div className="border-t border-slate-200/70 dark:border-slate-800 p-2.5 bg-slate-100/50 dark:bg-slate-900/50 text-xs">
        <button
          onClick={() => setIsClipSectionOpen(!isClipSectionOpen)}
          className="w-full flex items-center justify-between font-bold chai-text-primary px-1 py-0.5"
        >
          <span className="flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span>ภาคตัดขวาง 3 มิติ (Cross-Section)</span>
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              clippingConfig.enabled
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 chai-text-secondary'
            }`}
          >
            {clippingConfig.enabled ? 'เปิดใช้งาน' : 'ปิด'}
          </span>
        </button>

        {isClipSectionOpen && (
          <div className="mt-2.5 space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between gap-1.5">
              <button
                onClick={() =>
                  onChangeClippingConfig({
                    ...clippingConfig,
                    enabled: !clippingConfig.enabled
                  })
                }
                className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold text-[11px] transition ${
                  clippingConfig.enabled
                    ? 'bg-blue-600 text-white'
                    : 'chai-card hover:border-blue-500/40'
                }`}
              >
                {clippingConfig.enabled ? 'ปิดมีดตัดขวาง' : 'เปิดมีดตัดขวาง 3D'}
              </button>
              <button
                onClick={() =>
                  onChangeClippingConfig({
                    ...clippingConfig,
                    invert: !clippingConfig.invert
                  })
                }
                className="py-1.5 px-2.5 rounded-lg chai-card text-[11px] font-medium hover:border-blue-500/40"
                title="สลับฝั่งที่ถูกตัดออก"
              >
                สลับฝั่ง
              </button>
              <button
                onClick={() =>
                  onChangeClippingConfig({
                    enabled: false,
                    axis: 'x',
                    position: 0,
                    invert: false,
                    showHelper: true
                  })
                }
                className="p-1.5 rounded-lg chai-card hover:border-blue-500/40"
                title="รีเซ็ตระนาบตัด"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Plane Axis Selector */}
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              {[
                { axis: 'x', label: 'ซ้าย-ขวา (X)' },
                { axis: 'z', label: 'หัว-ท้าย (Z)' },
                { axis: 'y', label: 'บน-ล่าง (Y)' }
              ].map((item) => (
                <button
                  key={item.axis}
                  onClick={() =>
                    onChangeClippingConfig({
                      ...clippingConfig,
                      enabled: true,
                      axis: item.axis,
                      position: 0
                    })
                  }
                  className={`py-1 rounded-md font-semibold transition ${
                    clippingConfig.axis === item.axis && clippingConfig.enabled
                      ? 'bg-indigo-600 text-white'
                      : 'chai-card chai-text-secondary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Position Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] chai-text-secondary">
                <span>{axisRange.label}</span>
                <span className="font-mono">{clippingConfig.position.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={axisRange.min}
                max={axisRange.max}
                step={0.01}
                value={clippingConfig.position}
                onChange={(e) =>
                  onChangeClippingConfig({
                    ...clippingConfig,
                    enabled: true,
                    position: parseFloat(e.target.value)
                  })
                }
                className="w-full h-1.5 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
