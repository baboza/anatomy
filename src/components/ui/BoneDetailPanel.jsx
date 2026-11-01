import React, { useState, useEffect } from 'react';
import {
  X,
  Crosshair,
  Eye,
  Star,
  CheckCircle2,
  Stethoscope,
  Image as ImageIcon,
  BookOpen,
  Link2,
  Save,
  Maximize2,
  ExternalLink,
  Layers,
  Columns3,
  Edit3
} from 'lucide-react';
import { BONE_BY_ID, VET_PATHOLOGIES } from '../../data/canineSkeletonData';
import { CANINE_MEDIA_CATALOG } from '../../data/canineMediaData';
import { CEPHALIC_TYPE_ORDER, CEPHALIC_TYPES } from '../../utils/cephalicMorph';
import { getLocalNotes, saveBoneNote } from '../../services/firebase';

const CATEGORY_LABELS = {
  axial: 'โครงกระดูกแกนกลาง (Axial)',
  appendicular_fore: 'รยางค์ขาหน้า (Thoracic Limb)',
  appendicular_hind: 'รยางค์ขาหลัง (Pelvic Limb)',
  visceral: 'กระดูกอวัยวะภายใน (Visceral)'
};

const MEDIA_BADGES = {
  radiograph: { label: 'ภาพเอกซเรย์ X-Ray', cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30' },
  specimen: { label: 'กระดูกจริงพิพิธภัณฑ์', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
  diagram: { label: 'แผนภาพกายวิภาค', cls: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
  histology: { label: 'จุลกายวิภาคกระดูก', cls: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' }
};

export default function BoneDetailPanel({
  bone,
  bones = [],
  pathologies = VET_PATHOLOGIES,
  isAdmin = false,
  onEditBoneInAdmin,
  cephalicType = 'mesocephalic',
  onChangeCephalicType,
  onOpenCephalicCompare,
  selectedMeshName,
  onSelectBone,
  onClose,
  onFocusBone,
  isolatedMode,
  onToggleIsolatedMode,
  ghostOpacity = 0.14,
  onChangeGhostOpacity,
  isStudied,
  onToggleStudied,
  isBookmarked,
  onToggleBookmark,
  onSelectPathology
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'media' | 'clinical' | 'roots'
  const [noteText, setNoteText] = useState('');
  const [noteSavedToast, setNoteSavedToast] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  useEffect(() => {
    if (!bone) return;
    const notes = getLocalNotes();
    setNoteText(notes[bone.id]?.text || '');
  }, [bone?.id]);

  if (!bone) return null;

  const liveBoneMap =
    bones.length > 0 ? Object.fromEntries(bones.map((b) => [b.id, b])) : BONE_BY_ID;

  const customMediaList = Array.isArray(bone.customMedia) ? bone.customMedia : [];
  const mediaList = [
    ...customMediaList,
    ...(bone.mediaIds || []).map((id) => CANINE_MEDIA_CATALOG[id]).filter(Boolean)
  ];

  const matchingPathologies = pathologies.filter((p) =>
    (p.affectedBones || []).includes(bone.id)
  );

  const relatedBones = (bone.relatedIds || [])
    .map((id) => liveBoneMap[id])
    .filter(Boolean);

  const activeSubPiece = selectedMeshName
    ? (bone.subPieces || []).find((sp) => sp.meshName === selectedMeshName)
    : null;

  const handleSaveNote = async () => {
    await saveBoneNote(bone.id, noteText);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2000);
  };

  return (
    <>
      <aside className="absolute top-3 right-3 bottom-20 z-20 w-80 sm:w-[390px] rounded-2xl chai-panel flex flex-col overflow-hidden animate-fade-in">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200/70 dark:border-slate-800 space-y-2.5">
          {/* Badges & Close */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: bone.color }}
              >
                {CATEGORY_LABELS[bone.category] || 'Osteology'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold chai-card">
                {bone.fidelity === 'scan' ? '3D CT / Laser Scan' : 'Segmented 3D Mesh'}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {isAdmin && onEditBoneInAdmin && (
                <button
                  onClick={() => onEditBoneInAdmin(bone.id)}
                  className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1 transition"
                  title="แก้ไขเนื้อหากระดูกชิ้นนี้ในหน้า Admin"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>แก้ไข</span>
                </button>
              )}
              <button
                onClick={() => onToggleBookmark(bone.id)}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                title={isBookmarked ? 'นำออกจากรายการปักหมุด' : 'ปักหมุดชิ้นกระดูกนี้'}
              >
                <Star
                  className={`w-4 h-4 ${
                    isBookmarked
                      ? 'fill-amber-400 text-amber-400'
                      : 'chai-text-secondary'
                  }`}
                />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 chai-text-secondary transition"
                title="ปิดหน้าต่างข้อมูล"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Titles */}
          <div>
            <h2 className="text-base sm:text-lg font-extrabold chai-text-primary leading-snug">
              {bone.nameTh}
            </h2>
            <div className="text-xs font-semibold chai-text-secondary mt-0.5">
              {bone.nameEn}
            </div>
            <div className="text-[11px] italic text-blue-600 dark:text-sky-400 font-medium">
              NAV: {bone.nameLatin}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-3 gap-1.5 pt-0.5 text-[11px]">
            <button
              onClick={() => onToggleStudied(bone.id)}
              className={`py-1.5 px-2 rounded-xl font-semibold flex items-center justify-center gap-1 border transition-all ${
                isStudied
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'chai-card hover:border-emerald-500/50 chai-text-primary'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isStudied ? 'เรียนแล้ว' : 'บันทึกว่าเรียน'}</span>
            </button>

            <button
              onClick={onToggleIsolatedMode}
              className={`py-1.5 px-2 rounded-xl font-semibold flex items-center justify-center gap-1 border transition-all ${
                isolatedMode
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'chai-card hover:border-blue-500/50 chai-text-primary'
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>{isolatedMode ? 'แสดงรวม' : 'เฉพาะชิ้นนี้'}</span>
            </button>

            <button
              onClick={onFocusBone}
              className="py-1.5 px-2 rounded-xl font-semibold chai-card hover:border-blue-500/50 chai-text-primary flex items-center justify-center gap-1 transition-all"
            >
              <Crosshair className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
              <span>ซูมโฟกัส</span>
            </button>
          </div>

          {/* Ghost Opacity Slider when Isolated Mode is Active */}
          {isolatedMode && (
            <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] animate-fade-in">
              <span className="text-blue-700 dark:text-sky-300 font-medium text-[10px]">
                ความโปร่งแสงส่วนอื่น:
              </span>
              <input
                type="range"
                min={0}
                max={0.45}
                step={0.02}
                value={ghostOpacity}
                onChange={(e) => onChangeGhostOpacity && onChangeGhostOpacity(parseFloat(e.target.value))}
                className="w-24 h-1.5 cursor-pointer accent-blue-600"
                title="ปรับความโปร่งแสงของกระดูกข้างเคียงเมื่อแยกดูเฉพาะชิ้น"
              />
              <span className="font-mono text-[10px] w-7 text-right text-blue-600 dark:text-sky-400">
                {Math.round(ghostOpacity * 100)}%
              </span>
            </div>
          )}

          {/* Sub-Piece Selector for Paired or Multi-Segment Structures (e.g. L/R, T1–T13, Ribs 1–13) */}
          {bone.meshes.length > 1 && (
            <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold chai-text-secondary flex items-center gap-1">
                  <Layers className="w-3 h-3 text-blue-600 dark:text-sky-400" />
                  <span>เลือกดูชิ้นย่อย ({bone.meshes.length} ชิ้น):</span>
                </span>
                {activeSubPiece && (
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-sky-400 truncate max-w-[170px]">
                    {activeSubPiece.labelTh}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                <button
                  onClick={() => onSelectBone(bone.id, null)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                    !selectedMeshName
                      ? 'bg-blue-600 text-white'
                      : 'chai-card chai-text-secondary hover:border-blue-500/40'
                  }`}
                >
                  ครบชุด ({bone.meshes.length})
                </button>
                {(bone.subPieces || []).map((sp) => (
                  <button
                    key={sp.meshName}
                    onClick={() => onSelectBone(bone.id, sp.meshName)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold whitespace-nowrap transition ${
                      selectedMeshName === sp.meshName
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'chai-card chai-text-secondary hover:border-blue-500/40'
                    }`}
                    title={`${sp.labelTh} (${sp.labelEn})`}
                  >
                    {sp.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-200/70 dark:border-slate-800 text-[11px] font-bold bg-slate-100/50 dark:bg-slate-900/40">
          {[
            { id: 'overview', label: 'ภาพรวม' },
            { id: 'media', label: `เอกซเรย์ (${mediaList.length})` },
            { id: 'clinical', label: 'คลินิก' },
            { id: 'roots', label: 'รากศัพท์/โน้ต' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 text-center border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:border-sky-400 dark:text-sky-400 bg-blue-500/5'
                  : 'border-transparent chai-text-secondary hover:chai-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div className="p-3 rounded-xl bg-blue-600/8 border border-blue-500/20 chai-text-primary font-medium">
                {bone.summaryTh}
              </div>

              {/* Interactive 3 Cephalic Types Selector when inspecting Skull, Mandible, or Hyoid */}
              {(bone.id === 'skull' || bone.id === 'mandible' || bone.id === 'hyoid') && (
                <div className="p-3 rounded-xl chai-card border border-blue-500/30 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold chai-text-primary text-xs">
                      รูปทรงกะโหลกสุนัข 3 ประเภท (Cephalic Types)
                    </span>
                    {onOpenCephalicCompare && (
                      <button
                        onClick={onOpenCephalicCompare}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 transition"
                      >
                        <Columns3 className="w-3 h-3" />
                        <span>เทียบ 3 กะโหลกพร้อมกัน</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {CEPHALIC_TYPE_ORDER.map((typeId) => {
                      const c = CEPHALIC_TYPES[typeId];
                      const active = cephalicType === typeId;
                      return (
                        <button
                          key={typeId}
                          onClick={() => onChangeCephalicType && onChangeCephalicType(typeId)}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            active
                              ? 'text-white shadow-sm'
                              : 'chai-card hover:border-blue-500/40'
                          }`}
                          style={
                            active
                              ? { backgroundColor: c.accentColor, borderColor: c.accentColor }
                              : undefined
                          }
                        >
                          <div className="text-[11px] font-extrabold truncate">{c.nameEn}</div>
                          <div
                            className={`text-[10px] truncate ${
                              active ? 'text-white/90 font-semibold' : 'chai-text-secondary'
                            }`}
                          >
                            {c.headShapeEn}
                          </div>
                          <div
                            className={`text-[9px] font-mono mt-0.5 ${
                              active ? 'text-white/85' : 'chai-text-muted'
                            }`}
                          >
                            CI {c.cephalicIndex}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {CEPHALIC_TYPES[cephalicType] && (
                    <div className="text-[11px] chai-text-secondary bg-slate-100/70 dark:bg-slate-900/60 rounded-lg p-2 space-y-0.5">
                      <div className="font-bold chai-text-primary">
                        {CEPHALIC_TYPES[cephalicType].nameTh} — {CEPHALIC_TYPES[cephalicType].headShapeEn}
                      </div>
                      <div>{CEPHALIC_TYPES[cephalicType].occlusionTh}</div>
                      <div className="text-[10px] chai-text-muted">
                        สายพันธุ์: {CEPHALIC_TYPES[cephalicType].breedsEn.slice(0, 5).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <h3 className="font-bold chai-text-primary text-xs uppercase tracking-wide">
                  รายละเอียดทางกายวิภาคศาสตร์สัตวแพทย์
                </h3>
                <p className="chai-text-secondary leading-relaxed">
                  {bone.descriptionTh}
                </p>
              </div>

              {bone.landmarks?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold chai-text-primary text-xs">
                    ปุ่มกระดูกและร่องสำคัญ (Osteological Landmarks)
                  </h3>
                  <ul className="space-y-1.5">
                    {bone.landmarks.map((lm, i) => (
                      <li
                        key={i}
                        className="p-2 rounded-xl chai-card flex items-start gap-2"
                      >
                        <span className="w-4 h-4 rounded-full bg-blue-600/15 text-blue-600 dark:text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="chai-text-primary">{lm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {bone.articulations?.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="font-bold chai-text-primary text-xs">
                    ข้อต่อและการเชื่อมต่อ (Articulations)
                  </h3>
                  <ul className="list-disc list-inside space-y-1 chai-text-secondary">
                    {bone.articulations.map((art, i) => (
                      <li key={i}>{art}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* TAB 2: WIKIMEDIA X-RAYS, SPECIMENS & PLATES */}
          {activeTab === 'media' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold chai-text-primary flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                  <span>ภาพถ่ายเอกซเรย์และตัวอย่างอ้างอิงจริง</span>
                </span>
                <span className="text-[10px] chai-text-muted">คลิกเพื่อขยายเต็มจอ</span>
              </div>

              {mediaList.map((media) => {
                const badge = MEDIA_BADGES[media.type] || MEDIA_BADGES.diagram;
                return (
                  <div
                    key={media.id}
                    onClick={() => setLightboxMedia(media)}
                    className="group rounded-xl chai-card overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all shadow-sm"
                  >
                    <div className="relative h-40 bg-slate-900/90 flex items-center justify-center overflow-hidden">
                      <img
                        src={media.url}
                        alt={media.titleTh}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md bg-white/90 dark:bg-slate-900/90 ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                      <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/75 text-white opacity-0 group-hover:opacity-100 transition">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div className="p-2.5 space-y-1">
                      <div className="font-bold chai-text-primary leading-snug">
                        {media.titleTh}
                      </div>
                      <p className="text-[11px] chai-text-secondary line-clamp-2">
                        {media.captionTh}
                      </p>
                      <div className="text-[10px] chai-text-muted pt-0.5">
                        {media.license} · {media.attribution}
                      </div>
                    </div>
                  </div>
                );
              })}

              {mediaList.length === 0 && (
                <div className="p-6 text-center chai-text-secondary">
                  ยังไม่มีภาพเฉพาะสำหรับชิ้นนี้ สามารถดูแผนภาพรวมได้จากปุ่ม “ภาพเอกซเรย์ & Wiki” ด้านบน
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CLINICAL PEARLS, PATHOLOGIES & RELATED BONES */}
          {activeTab === 'clinical' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-rose-500/8 border border-rose-500/25 space-y-1.5">
                <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  <span>ความสำคัญทางคลินิกและศัลยกรรมออร์โธปิดิกส์</span>
                </div>
                <p className="chai-text-primary leading-relaxed">
                  {bone.clinicalNotes}
                </p>
              </div>

              {matchingPathologies.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold chai-text-primary">
                    โรคที่พบบ่อยในกระดูกชิ้นนี้ ({matchingPathologies.length})
                  </h3>
                  {matchingPathologies.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectPathology(p)}
                      className="w-full p-3 rounded-xl chai-card hover:border-rose-500/50 text-left space-y-1 transition-all"
                    >
                      <div className="font-bold chai-text-primary flex items-center justify-between gap-2">
                        <span>{p.nameTh}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 shrink-0">
                          แยกดู 3D
                        </span>
                      </div>
                      <p className="text-[11px] chai-text-secondary">
                        {p.descriptionTh}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {relatedBones.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold chai-text-primary flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                    <span>กระดูกข้างเคียงที่เชื่อมต่อกัน (คลิกเพื่อสำรวจต่อ)</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {relatedBones.map((rel) => (
                      <button
                        key={rel.id}
                        onClick={() => onSelectBone(rel.id, null)}
                        className="px-2.5 py-1.5 rounded-xl chai-card hover:border-blue-500/60 flex items-center gap-1.5 font-semibold transition-all"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: rel.color }}
                        />
                        <span>{rel.nameTh}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WORD ROOTS (CHAi ETYMOLOGY) & CLOUD/LOCAL STUDY NOTES */}
          {activeTab === 'roots' && (
            <div className="space-y-4">
              {bone.wordRoots?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold chai-text-primary flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>ถอดรหัสศัพท์กายวิภาค (Decode the Name)</span>
                  </h3>
                  <div className="space-y-2">
                    {bone.wordRoots.map((wr, idx) => (
                      <div key={idx} className="p-3 rounded-xl chai-card space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-blue-700 dark:text-sky-300 text-xs">
                            {wr.root}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 chai-text-secondary">
                            {wr.origin}
                          </span>
                        </div>
                        <div className="font-semibold chai-text-primary pt-0.5">
                          {wr.meaningTh}
                        </div>
                        <div className="text-[11px] chai-text-muted">{wr.meaningEn}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Study Notes */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold chai-text-primary">
                    บันทึกช่วยจำส่วนตัว (ซิงค์ Local / Firebase)
                  </label>
                  {noteSavedToast && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      บันทึกสำเร็จแล้ว!
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="จดสรุปจุดเกาะเอ็น แนวผ่าตัด หรือข้อสังเกตจากภาพเอกซเรย์สำหรับกระดูกชิ้นนี้..."
                  className="w-full rounded-xl p-3 chai-card text-xs chai-text-primary focus:outline-none focus:border-blue-500 resize-none"
                />
                <button
                  onClick={handleSaveNote}
                  className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกโน้ตสำหรับ {bone.nameTh}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Fullscreen Lightbox for Radiograph / Specimen / Wiki Diagram */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/88 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setLightboxMedia(null)}
        >
          <div
            className="max-w-5xl w-full max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-slate-100">
              <div>
                <h3 className="text-sm font-bold">{lightboxMedia.titleTh}</h3>
                <p className="text-[11px] text-slate-400">{lightboxMedia.titleEn}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxMedia.svgUrl || lightboxMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs flex items-center gap-1.5 text-sky-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>เปิดไฟล์ต้นฉบับ</span>
                </a>
                <button
                  onClick={() => setLightboxMedia(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-black/80 flex items-center justify-center p-4 overflow-auto min-h-[320px]">
              <img
                src={lightboxMedia.svgUrl || lightboxMedia.url}
                alt={lightboxMedia.titleTh}
                className="max-h-[68vh] max-w-full object-contain rounded"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 space-y-1">
              <p>{lightboxMedia.captionTh}</p>
              <p className="text-[11px] text-slate-400">
                {lightboxMedia.captionEn} — <span className="text-sky-400">{lightboxMedia.license}</span> ({lightboxMedia.attribution})
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
