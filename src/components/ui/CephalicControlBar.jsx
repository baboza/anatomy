import React, { useState } from 'react';
import {
  Columns3,
  ArrowLeft,
  Ruler,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Stethoscope,
  Maximize2,
  X,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { CEPHALIC_TYPE_ORDER, CEPHALIC_TYPES } from '../../utils/cephalicMorph';
import { CANINE_MEDIA_CATALOG } from '../../data/canineMediaData';

export function CephalicFloatingSwitcher({
  cephalicType,
  onChangeCephalicType,
  cephalicCompareMode,
  onToggleCephalicCompareMode,
  comparisonView,
  onChangeComparisonView,
  compareShowMandible,
  onToggleCompareMandible,
  compareJawOpenDeg,
  onChangeCompareJawOpenDeg,
  compareShowCalipers,
  onToggleCompareCalipers,
  hasActiveJourney = false
}) {
  return (
    <div
      className={`absolute ${
        hasActiveJourney ? 'top-20' : 'top-3'
      } left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 max-w-[94vw] transition-all`}
    >
      {/* Row 1: 3 Cephalic Types Selector + 3-Skull Comparison Studio Toggle */}
      <div className="chai-panel rounded-2xl px-2.5 py-1.5 flex flex-wrap items-center justify-center gap-1.5 shadow-lg">
        <span className="text-[11px] font-extrabold chai-text-secondary px-1.5 hidden xl:inline">
          รูปทรงกะโหลก 3 ประเภท:
        </span>

        <div className="flex items-center gap-1 p-0.5 rounded-xl chai-card">
          {CEPHALIC_TYPE_ORDER.map((typeId) => {
            const item = CEPHALIC_TYPES[typeId];
            const active = cephalicType === typeId;
            return (
              <button
                key={typeId}
                onClick={() => onChangeCephalicType(typeId)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  active
                    ? 'text-white shadow-sm'
                    : 'chai-text-secondary hover:chai-text-primary'
                }`}
                style={active ? { backgroundColor: item.accentColor } : undefined}
                title={`${item.nameEn} (${item.headShapeEn}) — ${item.nameTh}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: active ? '#ffffff' : item.accentColor }}
                />
                <span>{item.nameEn}</span>
                <span className="hidden md:inline opacity-85 font-medium text-[10px]">
                  ({item.shortTh.split(' ')[0]})
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onToggleCephalicCompareMode}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 border transition-all whitespace-nowrap ${
            cephalicCompareMode
              ? 'bg-slate-900 text-white border-slate-700 dark:bg-amber-500 dark:text-slate-950 dark:border-amber-400 shadow-md'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 hover:brightness-110 shadow-sm'
          }`}
          title="เปรียบเทียบกะโหลกสุนัขทั้ง 3 ประเภทเรียงกันแบบ 3 มิติ"
        >
          {cephalicCompareMode ? (
            <>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับโครงกระดูก 115 ชิ้น</span>
            </>
          ) : (
            <>
              <Columns3 className="w-3.5 h-3.5" />
              <span>เทียบครบ 3 กะโหลก (3D)</span>
            </>
          )}
        </button>
      </div>

      {/* Row 2: Dedicated Sub-Toolbar when 3-Skull Comparison Studio is Active */}
      {cephalicCompareMode && (
        <div className="chai-panel rounded-2xl px-3 py-1.5 flex flex-wrap items-center justify-center gap-2 text-[11px] shadow-md animate-fade-in">
          {/* Angle Presets */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl chai-card">
            {[
              { id: 'dorsal', label: 'ด้านบน (Dorsal Poster)' },
              { id: 'lateral', label: 'ด้านข้าง (เทียบดั้ง & ฟัน)' },
              { id: '3d', label: 'มุมเฉียง 3D' },
              { id: 'rostral', label: 'ด้านหน้า' },
              { id: 'ventral', label: 'ด้านเพดานปาก' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => onChangeComparisonView(v.id)}
                className={`px-2 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  comparisonView === v.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'chai-text-secondary hover:chai-text-primary'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Toggle Mandible (Off = pure cranium like poster; On = articulated lower jaw & occlusion) */}
          <button
            onClick={onToggleCompareMandible}
            className={`px-2.5 py-1 rounded-xl font-semibold border flex items-center gap-1 transition ${
              compareShowMandible
                ? 'bg-blue-600/12 border-blue-500/40 text-blue-700 dark:text-sky-300'
                : 'chai-card chai-text-secondary'
            }`}
            title="เปิด/ปิดกระดูกขากรรไกรล่าง (ปิดเพื่อดูเฉพาะกะโหลกบนเหมือนโปสเตอร์)"
          >
            {compareShowMandible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>ขากรรไกรล่าง: {compareShowMandible ? 'แสดง' : 'ซ่อน'}</span>
          </button>

          {/* TMJ Jaw Open Slider */}
          {compareShowMandible && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl chai-card">
              <SlidersHorizontal className="w-3 h-3 text-blue-600 dark:text-sky-400" />
              <span className="font-semibold chai-text-primary">อ้าปาก:</span>
              <input
                type="range"
                min={0}
                max={28}
                step={1}
                value={compareJawOpenDeg}
                onChange={(e) => onChangeCompareJawOpenDeg(Number(e.target.value))}
                className="w-16 h-1.5 cursor-pointer"
              />
              <span className="font-mono text-[10px] w-6 text-right chai-text-secondary">
                {compareJawOpenDeg}°
              </span>
            </div>
          )}

          {/* Toggle Cephalic Index 3D Calipers */}
          <button
            onClick={onToggleCompareCalipers}
            className={`px-2.5 py-1 rounded-xl font-semibold border flex items-center gap-1 transition ${
              compareShowCalipers
                ? 'bg-emerald-600/12 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                : 'chai-card chai-text-secondary'
            }`}
            title="แสดงเส้นวัดความกว้างโหนกแก้ม (W) และความยาวกะโหลก (L)"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>เส้นวัด CI</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Right-Side Inspector Panel shown during 3-Skull Comparison Studio Mode
 */
export function CephalicComparisonInspector({
  activeType = 'mesocephalic',
  onSelectType,
  onApplyToFullSkeleton,
  onExitCompare
}) {
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const current = CEPHALIC_TYPES[activeType] || CEPHALIC_TYPES.mesocephalic;
  const mediaItems = (current.wikiMediaIds || [])
    .map((id) => CANINE_MEDIA_CATALOG[id])
    .filter(Boolean);

  return (
    <>
      <aside className="absolute top-3 right-3 bottom-20 z-20 w-80 sm:w-[400px] rounded-2xl chai-panel flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/70 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white">
              CEPHALIC TYPE · 3D MORPHOMETRY
            </span>
            <button
              onClick={onExitCompare}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 chai-text-secondary transition"
              title="ออกจากโหมดเปรียบเทียบ 3 กะโหลก"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-extrabold chai-text-primary leading-snug">
              เปรียบเทียบกะโหลกสุนัขครบทั้ง 3 ประเภท
            </h2>
            <p className="text-[11px] chai-text-secondary mt-0.5">
              จำแนกตามดัชนีกะโหลก{' '}
              <span className="font-mono font-semibold">
                CI = (ความกว้างโหนกแก้ม ÷ ความยาวกะโหลก) × 100
              </span>
            </p>
          </div>

          {/* 3 Mini Summary Cards (Click to inspect any of the 3!) */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {CEPHALIC_TYPE_ORDER.map((id) => {
              const t = CEPHALIC_TYPES[id];
              const isSel = id === activeType;
              return (
                <button
                  key={id}
                  onClick={() => onSelectType(id)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSel ? 'ring-2 shadow-sm chai-card' : 'chai-card opacity-75 hover:opacity-100'
                  }`}
                  style={{
                    borderColor: isSel ? t.accentColor : undefined
                  }}
                >
                  <div className="text-[11px] font-extrabold truncate" style={{ color: t.accentColor }}>
                    {t.nameEn}
                  </div>
                  <div className="text-[10px] font-bold chai-text-primary truncate">
                    {t.headShapeEn}
                  </div>
                  <div className="text-[10px] font-mono chai-text-secondary mt-0.5">
                    CI: {t.cephalicIndex}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Details of Selected Cephalic Type */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs leading-relaxed">
          {/* Active Type Banner */}
          <div
            className="p-3 rounded-xl border space-y-1"
            style={{
              backgroundColor: `${current.accentColor}12`,
              borderColor: `${current.accentColor}40`
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-extrabold" style={{ color: current.accentColor }}>
                {current.nameEn} — {current.headShapeEn}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/80 dark:bg-slate-900/80 chai-text-primary">
                CI {current.cephalicIndex}
              </span>
            </div>
            <div className="font-bold chai-text-primary">{current.nameTh}</div>
            <div className="text-[11px] chai-text-secondary">{current.headShapeTh}</div>
            <div className="text-[10px] italic chai-text-muted pt-0.5">
              รากศัพท์: {current.etymology}
            </div>
          </div>

          {/* Craniofacial Metrics Table */}
          <div className="rounded-xl chai-card divide-y divide-slate-200/70 dark:divide-slate-800 text-[11px]">
            <div className="p-2.5 flex justify-between gap-3">
              <span className="font-bold chai-text-secondary shrink-0">สัดส่วนกล่องสมอง : ใบหน้า</span>
              <span className="font-semibold chai-text-primary text-right">{current.craniofacialRatio}</span>
            </div>
            <div className="p-2.5 flex justify-between gap-3">
              <span className="font-bold chai-text-secondary shrink-0">มุมหักดั้งจมูก (Stop)</span>
              <span className="font-semibold chai-text-primary text-right">{current.stopAngleTh}</span>
            </div>
            <div className="p-2.5 flex justify-between gap-3">
              <span className="font-bold chai-text-secondary shrink-0">รูปแบบการสบฟัน</span>
              <span className="font-semibold chai-text-primary text-right">{current.occlusionTh}</span>
            </div>
          </div>

          {/* Representative Dog Breeds */}
          <div className="space-y-1.5">
            <h3 className="font-bold chai-text-primary text-xs">
              สายพันธุ์สุนัขตัวอย่าง (Representative Breeds)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {current.breedsTh.map((breed, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold chai-card"
                >
                  {breed}
                </span>
              ))}
            </div>
          </div>

          {/* Osteological Hallmarks */}
          <div className="space-y-1.5">
            <h3 className="font-bold chai-text-primary text-xs">
              จุดเด่นทางโครงสร้างกระดูกกะโหลก (Osteological Features)
            </h3>
            <ul className="space-y-1.5">
              {current.osteologyPointsTh.map((pt, idx) => (
                <li key={idx} className="p-2 rounded-xl chai-card flex items-start gap-2">
                  <span
                    className="w-4 h-4 rounded-full text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: current.accentColor }}
                  >
                    {idx + 1}
                  </span>
                  <span className="chai-text-primary">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Significance */}
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1">
            <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>ความสำคัญทางคลินิกสัตวแพทย์</span>
            </div>
            <p className="text-[11px] chai-text-primary leading-relaxed">
              {current.clinicalNotesTh}
            </p>
          </div>

          {/* Apply to Full 115-Bone Skeleton CTA */}
          <button
            onClick={() => onApplyToFullSkeleton(current.id)}
            className="w-full py-2.5 px-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:brightness-110"
            style={{ backgroundColor: current.accentColor }}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>สวมกะโหลก {current.nameEn} ลงบนโครงกระดูกเต็มตัว 115 ชิ้น</span>
          </button>

          {/* Reference Museum Skull Photos */}
          {mediaItems.length > 0 && (
            <div className="space-y-2 pt-1">
              <h3 className="font-bold chai-text-primary text-xs">
                ภาพถ่ายกะโหลกจริงอ้างอิง (Wikimedia Osteology)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {mediaItems.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setLightboxMedia(m)}
                    className="group rounded-xl chai-card overflow-hidden cursor-pointer hover:border-blue-500/50 transition"
                  >
                    <div className="relative h-24 bg-slate-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={m.url}
                        alt={m.titleTh}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1.5 right-1.5 p-1 rounded bg-slate-900/75 text-white opacity-0 group-hover:opacity-100 transition">
                        <Maximize2 className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] font-bold chai-text-primary line-clamp-2 leading-snug">
                        {m.titleTh}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Lightbox */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxMedia(null)}
        >
          <div
            className="max-w-4xl w-full chai-panel rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div className="font-bold text-sm chai-text-primary truncate pr-3">
                {lightboxMedia.titleTh}
              </div>
              <button
                onClick={() => setLightboxMedia(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-950 flex items-center justify-center max-h-[70vh] p-4">
              <img
                src={lightboxMedia.url}
                alt={lightboxMedia.titleTh}
                className="max-h-[66vh] max-w-full object-contain"
              />
            </div>
            <div className="p-3.5 text-xs space-y-1">
              <p className="chai-text-primary">{lightboxMedia.captionTh}</p>
              <div className="flex items-center justify-between text-[11px] chai-text-muted pt-1">
                <span>
                  {lightboxMedia.license} · {lightboxMedia.attribution}
                </span>
                {lightboxMedia.url.startsWith('http') && (
                  <a
                    href={lightboxMedia.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-sky-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>เปิดไฟล์ต้นฉบับ</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
