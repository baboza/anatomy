import React from 'react';
import {
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { CONNECTED_JOURNEYS } from '../../data/canineMediaData';

export function ActiveJourneyBanner({
  journey,
  stepIndex,
  onStepChange,
  onExit
}) {
  if (!journey) return null;
  const step = journey.steps[stepIndex];
  const total = journey.steps.length;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[92vw] max-w-xl rounded-2xl chai-panel border-2 border-blue-500/40 p-3 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0"
            style={{ backgroundColor: journey.badgeColor }}
          >
            บทเรียน {stepIndex + 1}/{total}
          </span>
          <span className="text-xs font-extrabold chai-text-primary truncate">
            {journey.titleTh}
          </span>
        </div>
        <button
          onClick={onExit}
          className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 chai-text-secondary"
          title="จบโหมดบทเรียนเชื่อมโยง"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="pt-2 space-y-1">
        <div className="text-xs font-bold text-blue-600 dark:text-sky-400">
          {step.titleTh}
        </div>
        <p className="text-xs chai-text-primary leading-relaxed">
          {step.noteTh}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
        <button
          disabled={stepIndex === 0}
          onClick={() => onStepChange(stepIndex - 1)}
          className="px-2.5 py-1 rounded-xl chai-card font-semibold flex items-center gap-1 disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>ก่อนหน้า</span>
        </button>

        <div className="flex items-center gap-1">
          {journey.steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onStepChange(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === stepIndex
                  ? 'w-5 bg-blue-600'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (stepIndex + 1 < total) {
              onStepChange(stepIndex + 1);
            } else {
              onExit();
            }
          }}
          className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1"
        >
          <span>{stepIndex + 1 < total ? 'ถัดไป' : 'เสร็จสิ้น'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function JourneysModal({ isOpen, onClose, onStartJourney }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] rounded-2xl chai-panel overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-600 dark:text-sky-400 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold chai-text-primary">
                บทเรียนเชื่อมโยง 3 มิติ (Connected Osteology Journeys)
              </h2>
              <p className="text-[11px] chai-text-secondary">
                เรียนรู้ชีวกลศาสตร์โครงกระดูกสุนัขแบบทีละขั้นตอน กล้อง 3D จะพาซูมไปยังชิ้นกระดูกสำคัญอัตโนมัติ
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

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {CONNECTED_JOURNEYS.map((j) => (
            <div
              key={j.id}
              className="p-4 rounded-2xl chai-card flex flex-col justify-between gap-3 hover:border-blue-500/50 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: j.badgeColor }}
                  >
                    {j.duration}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold chai-text-primary leading-snug">
                  {j.titleTh}
                </h3>
                <div className="text-[11px] font-medium chai-text-muted">
                  {j.titleEn}
                </div>
                <p className="chai-text-secondary leading-relaxed">
                  {j.summaryTh}
                </p>
              </div>

              <button
                onClick={() => {
                  onStartJourney(j);
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>เริ่มสำรวจบทเรียนนี้ใน 3D</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
