import React, { useState, useMemo } from 'react';
import {
  X,
  GraduationCap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CANINE_BONES } from '../../data/canineSkeletonData';

const QUIZ_BANK = [
  {
    q: 'กระดูกชิ้นใดของสุนัขมี “รูทะลุเหนือลูกกลิ้งข้อศอก (Supratrochlear foramen)” อันเป็นลักษณะเด่นเฉพาะ?',
    correctId: 'humerus',
    options: ['humerus', 'femur', 'scapula', 'radius'],
    explain: 'ปลายล่างของกระดูกต้นขาหน้า (Humerus) สุนัขมีรู Supratrochlear foramen ทะลุถึงกัน รองรับ Anconeal process ของ Ulna'
  },
  {
    q: 'กระดูกสันหลังส่วนอกปล้องที่ 11 (Anticlinal vertebra) ซึ่งยอด Spinous process ตั้งฉากตรง อยู่ใรกลุ่มโครงสร้างใด?',
    correctId: 'vertebrae-thoracic',
    options: ['vertebrae-thoracic', 'vertebrae-cervical', 'vertebrae-lumbar', 'sacrum'],
    explain: 'สุนัขมีกระดูกสันหลังอก 13 ปล้อง (T1–T13) โดยมี T11 เป็น Anticlinal vertebra จุดเปลี่ยนแนวแรงของหลัง'
  },
  {
    q: 'กระดูกอวัยวะภายใน (Visceral bone) ชิ้นใดมีร่องท่อปัสสาวะด้านท้องที่นิ่วมักไปอุดตันในสุนัขเพศผู้?',
    correctId: 'os-penis',
    options: ['os-penis', 'os-coxae', 'hyoid', 'manubrium'],
    explain: 'Os penis (Baculum) มีร่อง Sulcus urethralis หุ้มท่อปัสสาวะ ทำให้นิ่วจากกระเพาะปัสสาวะมักติดค้างที่ขอบฐานด้านท้ายของกระดูกชิ้นนี้'
  },
  {
    q: 'กระดูกงา (Sesamoid bone) ชิ้นใหญ่ที่สุดในร่างกายสุนัข ที่มักเคลื่อนหลุดเข้าด้านใน (MPL) ในสุนัขพันธุ์เล็กคือ?',
    correctId: 'patella',
    options: ['patella', 'carpus', 'tarsus', 'fibula'],
    explain: 'กระดูกสะบ้า (Patella) ฝังอยู่ในเอ็นกล้ามเนื้อ Quadriceps ทำหน้าที่เป็นรอกทดแรงหน้าข้อเข่า'
  },
  {
    q: 'การผ่าตัด TPLO เพื่อรักษาภาวะเอ็นไขว้หน้าข้อเข่าขาด เป็นการเลื่อยปรับมุมลานกระดูกชิ้นใด?',
    correctId: 'tibia',
    options: ['tibia', 'femur', 'fibula', 'os-coxae'],
    explain: 'TPLO (Tibial Plateau Leveling Osteotomy) เป็นการปรับลดมุมลาดเอียงของลานกระดูกหน้าแข้ง (Tibia)'
  },
  {
    q: 'กระดูกคอชิ้นที่มีเดือยแกนหมุน Dens (Odontoid process) สำหรับส่ายหน้าซ้าย-ขวา คือชิ้นใด?',
    correctId: 'axis',
    options: ['axis', 'atlas', 'vertebra-c7', 'hyoid'],
    explain: 'กระดูกคอชิ้นที่ 2 (Axis / C2) มีเดือย Dens สอดเข้าไปในวงแหวนของ Atlas (C1)'
  },
  {
    q: 'สุนัขมีกระดูกซี่โครง (Costae) ทั้งหมดกี่คู่ในแบบจำลองกายวิภาคมาตรฐาน?',
    correctId: 'ribs',
    options: ['ribs', 'sternum', 'manubrium', 'scapula'],
    customChoiceLabels: {
      ribs: '13 คู่ (26 ชิ้น: ซี่โครงแท้ 9, ชายโครง 3, ซี่โครงลอย 1)',
      sternum: '12 คู่ (24 ชิ้น เหมือนในมนุษย์)',
      manubrium: '8 คู่ (16 ชิ้น เท่าจำนวนปล้องกระดูกอก)',
      scapula: '18 คู่ (36 ชิ้น เหมือนในม้า)'
    },
    explain: 'สุนัขมีซี่โครง 13 คู่ (26 ชิ้น) เกาะกับกระดูกสันหลังส่วนอก T1–T13'
  }
];

export default function QuizModal({ isOpen, onClose, onSelectBone }) {
  const [idx, setIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const boneMap = useMemo(
    () => Object.fromEntries(CANINE_BONES.map((b) => [b.id, b])),
    []
  );

  if (!isOpen) return null;

  const current = QUIZ_BANK[idx];

  const handleChoose = (optId) => {
    if (selectedAns) return;
    setSelectedAns(optId);
    if (optId === current.correctId) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (idx + 1 < QUIZ_BANK.length) {
      setIdx((i) => i + 1);
      setSelectedAns(null);
    } else {
      setFinished(true);
      if (score >= Math.ceil(QUIZ_BANK.length * 0.7)) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const handleRestart = () => {
    setIdx(0);
    setSelectedAns(null);
    setScore(0);
    setFinished(false);
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
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold chai-text-primary">
                แบบทดสอบกายวิภาคศาสตร์โครงกระดูกสุนัข
              </h2>
              <p className="text-[11px] chai-text-secondary">
                ทดสอบความแม่นยำด้าน Osteology, NAV Latin และความเชื่อมโยงทางคลินิก
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

        {finished ? (
          <div className="p-6 text-center space-y-4">
            <div className="text-3xl font-extrabold text-blue-600 dark:text-sky-400">
              {score} / {QUIZ_BANK.length} คะแนน
            </div>
            <p className="text-xs chai-text-secondary">
              {score === QUIZ_BANK.length
                ? 'ยอดเยี่ยมระดับอาจารย์กายวิภาคสัตวแพทย์! คุณตอบถูกครบทุกข้อ'
                : 'ทบทวนชิ้นกระดูกเพิ่มเติมในโหมด 3D แล้วกลับมาทำสถิติเต็มอีกครั้งได้เสมอ'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ทำแบบทดสอบอีกครั้ง</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl chai-card text-xs font-semibold"
              >
                กลับสู่โมเดล 3D
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between text-[11px] chai-text-secondary">
              <span>
                คำถามข้อที่ {idx + 1} จาก {QUIZ_BANK.length}
              </span>
              <span className="font-bold text-blue-600 dark:text-sky-400">
                คะแนนสะสม: {score}
              </span>
            </div>

            <h3 className="text-sm font-bold chai-text-primary leading-relaxed">
              {current.q}
            </h3>

            <div className="space-y-2">
              {current.options.map((optId) => {
                const b = boneMap[optId];
                const label = current.customChoiceLabels
                  ? current.customChoiceLabels[optId]
                  : `${b?.nameTh} · ${b?.nameEn} (${b?.nameLatin.split(' (')[0]})`;

                const isCorrect = optId === current.correctId;
                const isPicked = selectedAns === optId;

                let cls = 'chai-card hover:border-blue-500/50 chai-text-primary';
                if (selectedAns) {
                  if (isCorrect) {
                    cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-200';
                  } else if (isPicked) {
                    cls = 'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-200';
                  } else {
                    cls = 'chai-card opacity-55';
                  }
                }

                return (
                  <button
                    key={optId}
                    onClick={() => handleChoose(optId)}
                    className={`w-full p-3 rounded-xl border text-left font-semibold flex items-center justify-between gap-2 transition ${cls}`}
                  >
                    <span>{label}</span>
                    {selectedAns && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    {selectedAns && isPicked && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedAns && (
              <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 space-y-2">
                <p className="chai-text-primary leading-relaxed">{current.explain}</p>
                <div className="flex items-center justify-between pt-1">
                  {onSelectBone && (
                    <button
                      onClick={() => {
                        onSelectBone(current.correctId, null);
                        onClose();
                      }}
                      className="text-[11px] font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ซูมดูเฉลยชิ้นกระดูกนี้ใน 3D</span>
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold ml-auto"
                  >
                    {idx + 1 < QUIZ_BANK.length ? 'ข้อถัดไป' : 'ดูผลคะแนน'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
