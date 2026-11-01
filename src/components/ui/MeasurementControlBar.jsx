import React, { useState } from 'react';
import {
  Ruler,
  Compass,
  X,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  Check,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { CANINE_WORLD_TO_CM } from '../3d/MeasurementOverlay3D';

// Clinical Orthopedic Veterinary Reference Data
const CLINICAL_ANGLE_REFERENCES = [
  {
    id: 'norberg',
    title: 'Norberg Angle (มุมนอร์เบิร์ก)',
    region: 'ข้อสะโพก (Coxofemoral Joint)',
    normalRange: '≥ 105°',
    clinicalMeaning:
      'ใช้คัดกรองภาวะข้อสะโพกเสื่อม/หลวมในสุนัข (Canine Hip Dysplasia). มุมที่วัดจากเส้นเชื่อมศูนย์กลางหัวกระดูกต้นขาทั้งสองข้าง (Femoral Heads) ไปยังขอบเบ้าสะโพกส่วนหน้า (Cranial Acetabular Rim). หาก < 105° บ่งชี้ว่าหัวกระดูกสบเบ้าไม่สนิทและมีภาวะหลวม (Subluxation).',
    severityGuide: [
      { label: 'ปกติ แข็งแรงดี', condition: '≥ 105°', status: 'good' },
      { label: 'ข้อสะโพกเริ่มหลวมเล็กน้อย', condition: '100° – 104°', status: 'warning' },
      { label: 'ข้อสะโพกหลวมปานกลางถึงรุนแรง', condition: '< 100°', status: 'danger' }
    ]
  },
  {
    id: 'tpa',
    title: 'Tibial Plateau Angle (TPA - มุมระนาบหน้าแข้ง)',
    region: 'ข้อเข่า (Stifle Joint & Tibia)',
    normalRange: '18° – 24° (เฉลี่ย 22.6°)',
    clinicalMeaning:
      'มุมระหว่างแนวระนาบรับน้ำหนักของข้อต่อกระดูกหน้าแข้ง (Tibial Plateau) กับเส้นตั้งฉากของแกนยาวกระดูกหน้าแข้ง. เป็นมุมสำคัญที่สุดในการวางแผนผ่าตัด TPLO (Tibial Plateau Leveling Osteotomy) เมื่อเอ็นไขว้หน้าข้อเข่าขาด (CCLR). ศัลยแพทย์จะตัดหมุนกระดูกเพื่อปรับมุมให้เหลือ 5° – 6.5° เพื่อป้องกันกระดูกต้นขาสไลด์หลุด.',
    severityGuide: [
      { label: 'มุมปกติของสุนัข', condition: '18° – 24°', status: 'good' },
      { label: 'มุมชันสูง เสี่ยงเอ็นเข่าขาดง่าย', condition: '> 25°', status: 'warning' },
      { label: 'เป้าหมายหลังผ่าตัด TPLO', condition: '5° – 6.5°', status: 'good' }
    ]
  },
  {
    id: 'inclination',
    title: 'Femoral Angle of Inclination (มุมคอกระดูกต้นขา)',
    region: 'กระดูกต้นขา (Femur)',
    normalRange: '130° – 145°',
    clinicalMeaning:
      'มุมระหว่างแกนของคอกระดูกต้นขา (Femoral Neck Axis) กับแกนยาวของลำตัวกระดูก (Femoral Shaft Axis). หากมุมกว้างเกิน (> 145°) เรียกว่า Coxa Valga หากมุมแคบเกิน (< 130°) เรียกว่า Coxa Vara ส่งผลต่อการเดินและแรงกดในข้อสะโพก.',
    severityGuide: [
      { label: 'Coxa Vara (มุมแคบผิดปกติ)', condition: '< 130°', status: 'warning' },
      { label: 'ช่วงปกติ (Normal)', condition: '130° – 145°', status: 'good' },
      { label: 'Coxa Valga (มุมกว้างผิดปกติ)', condition: '> 145°', status: 'warning' }
    ]
  }
];

export default function MeasurementControlBar({
  measureMode = 'off',
  onChangeMode,
  points = [],
  onClearPoints,
  onClose
}) {
  const [showRefModal, setShowRefModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (measureMode === 'off') return null;

  // Compute live distance if 2 points
  let distanceCm = null;
  let distanceMm = null;
  if (measureMode === 'distance' && points.length >= 2) {
    const p1 = points[0].point;
    const p2 = points[1].point;
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    const dz = p1[2] - p2[2];
    const worldDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    distanceCm = (worldDist * CANINE_WORLD_TO_CM).toFixed(1);
    distanceMm = (worldDist * CANINE_WORLD_TO_CM * 10).toFixed(0);
  }

  // Compute live angle if 3 points
  let angleDeg = null;
  if (measureMode === 'angle' && points.length >= 3) {
    const p1 = points[0].point; // Arm 1
    const p2 = points[1].point; // Vertex
    const p3 = points[2].point; // Arm 2

    const v1 = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
    const v2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]];

    const l1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]);
    const l2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2]);

    if (l1 > 1e-4 && l2 > 1e-4) {
      const dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
      const cosTheta = Math.max(-1, Math.min(1, dot / (l1 * l2)));
      angleDeg = ((Math.acos(cosTheta) * 180) / Math.PI).toFixed(1);
    }
  }

  const handleCopyResult = () => {
    let text = '';
    if (measureMode === 'distance' && distanceCm) {
      text = `ระยะห่าง 3D: ${distanceCm} cm (${distanceMm} mm) ระหว่าง ${points[0].boneName} กับ ${points[1].boneName}`;
    } else if (measureMode === 'angle' && angleDeg) {
      text = `มุมกระดูกสัตว์แพทย์: ${angleDeg}° (แขนมุม 1: ${points[0].boneName}, จุดยอดมุม: ${points[1].boneName}, แขนมุม 2: ${points[2].boneName})`;
    }
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-xl chai-panel rounded-2xl shadow-2xl border border-blue-500/40 p-3 sm:p-4 animate-fade-in backdrop-blur-xl">
        {/* Top Control Bar Header */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-600 text-white shadow-sm">
              {measureMode === 'distance' ? (
                <Ruler className="w-4 h-4" />
              ) : (
                <Compass className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold chai-text-primary flex items-center gap-1.5">
                <span>
                  {measureMode === 'distance'
                    ? 'ไม้บรรทัดวัดระยะ 3D (3D Caliper)'
                    : 'เครื่องมือวัดมุมกระดูกทางคลินิก (Orthopedic Angles)'}
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] chai-text-secondary">
                สเกลกายวิภาคสุนัขมาตรฐาน · คลิกบนผิวกระดูกเพื่อวัดค่า
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowRefModal(true)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-sky-300 border border-blue-500/30 flex items-center gap-1 transition"
              title="ดูเกณฑ์มุมอ้างอิงทางศัลยกรรมกระดูกสัตว์แพทย์ (Norberg, TPA, Inclination)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">เกณฑ์อ้างอิง</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 chai-text-secondary transition"
              title="ปิดเครื่องมือวัด"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 mt-2.5 p-1 rounded-xl chai-card text-xs">
          <button
            onClick={() => {
              if (measureMode !== 'distance') {
                onChangeMode('distance');
                onClearPoints();
              }
            }}
            className={`py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
              measureMode === 'distance'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'chai-text-secondary hover:chai-text-primary'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>วัดระยะห่าง (2 จุด)</span>
          </button>

          <button
            onClick={() => {
              if (measureMode !== 'angle') {
                onChangeMode('angle');
                onClearPoints();
              }
            }}
            className={`py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
              measureMode === 'angle'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'chai-text-secondary hover:chai-text-primary'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>วัดมุมกระดูก (3 จุด)</span>
          </button>
        </div>

        {/* Guidance Prompt & Real-Time Progress */}
        <div className="mt-2.5 px-3 py-2 rounded-xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            {measureMode === 'distance' ? (
              <span className="chai-text-primary">
                {points.length === 0 && '👉 คลิกเลือก "จุดที่ 1" บนผิวกระดูก'}
                {points.length === 1 && '👉 คลิกเลือก "จุดที่ 2" เพื่อลากเส้นวัดระยะห่าง'}
                {points.length >= 2 && '✅ วัดระยะสำเร็จ (คลิกเพื่อเริ่มวัดจุดใหม่)'}
              </span>
            ) : (
              <span className="chai-text-primary">
                {points.length === 0 && '👉 คลิก "จุดที่ 1" (ปลายแขนมุมแรก เช่น ขอบเบ้าสะโพก)'}
                {points.length === 1 && '👉 คลิก "จุดที่ 2" (จุดยอดมุม Vertex เช่น หัวกระดูก)'}
                {points.length === 2 && '👉 คลิก "จุดที่ 3" (ปลายแขนที่สอง เพื่อคำนวณมุม)'}
                {points.length >= 3 && '✅ คำนวณมุมสำเร็จ (คลิกเพื่อเริ่มวัดจุดใหม่)'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {points.length > 0 && (
              <button
                onClick={onClearPoints}
                className="px-2 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 transition"
                title="ล้างจุดวัดทั้งหมด"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ล้างค่า</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Card */}
        {((measureMode === 'distance' && distanceCm) ||
          (measureMode === 'angle' && angleDeg)) && (
          <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 border border-blue-500/30 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            {measureMode === 'distance' && (
              <div>
                <div className="text-[11px] font-semibold text-blue-600 dark:text-sky-400">
                  ระยะห่างที่วัดได้:
                </div>
                <div className="text-xl sm:text-2xl font-black chai-text-primary font-mono leading-tight">
                  {distanceCm}{' '}
                  <span className="text-sm font-bold chai-text-secondary">cm</span>
                  <span className="text-xs font-semibold chai-text-secondary ml-2">
                    ({distanceMm} mm)
                  </span>
                </div>
                <div className="text-[11px] chai-text-secondary mt-0.5">
                  ระหว่าง: <strong className="chai-text-primary">{points[0]?.boneName}</strong>{' '}
                  ⟷ <strong className="chai-text-primary">{points[1]?.boneName}</strong>
                </div>
              </div>
            )}

            {measureMode === 'angle' && (
              <div>
                <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  มุมที่วัดได้ (Vertex Angle):
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-300 font-mono leading-tight">
                  {angleDeg}°
                </div>
                <div className="text-[11px] chai-text-secondary mt-0.5">
                  จุดยอดมุม: <strong className="chai-text-primary">{points[1]?.boneName}</strong>
                </div>
              </div>
            )}

            <button
              onClick={handleCopyResult}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอกผลวัด</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Clinical Veterinary Orthopedic Reference Modal */}
      {showRefModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="chai-panel w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-blue-500/30">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-blue-600 text-white shadow-md">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold chai-text-primary">
                    คู่มือเกณฑ์มุมกระดูกทางศัลยกรรมสัตว์แพทย์
                  </h2>
                  <p className="text-xs chai-text-secondary">
                    Veterinary Orthopedic Angle Guidelines & Surgical Planning
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRefModal(false)}
                className="p-2 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 chai-text-secondary transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {CLINICAL_ANGLE_REFERENCES.map((ref) => (
                <div
                  key={ref.id}
                  className="p-4 rounded-2xl chai-card border border-slate-200/70 dark:border-slate-800 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-blue-600 dark:text-sky-400">
                        {ref.title}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-300">
                        ตำแหน่ง: {ref.region}
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-500/30 font-mono">
                      เกณฑ์ปกติ: {ref.normalRange}
                    </div>
                  </div>

                  <p className="text-xs chai-text-secondary leading-relaxed">
                    {ref.clinicalMeaning}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    {ref.severityGuide.map((sev, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl border flex flex-col justify-between ${
                          sev.status === 'good'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                            : sev.status === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        <span className="font-bold text-[11px]">{sev.label}</span>
                        <span className="font-mono text-xs font-extrabold mt-1">
                          {sev.condition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200/70 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowRefModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                เข้าใจแล้ว / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
