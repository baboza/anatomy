import React from 'react';
import { X, Stethoscope, Eye, Activity } from 'lucide-react';
import { VET_PATHOLOGIES, BONE_BY_ID } from '../../data/canineSkeletonData';
import { CANINE_MEDIA_CATALOG } from '../../data/canineMediaData';

export default function PathologyModal({ isOpen, onClose, onSelectPathology }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[86vh] rounded-2xl chai-panel overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold chai-text-primary">
                คลินิกโรคกระดูกและข้อสุนัข (Canine Orthopedic Pathologies)
              </h2>
              <p className="text-[11px] chai-text-secondary">
                เปรียบเทียบฟิล์มเอกซเรย์ทางคลินิกกับตำแหน่งกระดูกจริงในโมเดล 3 มิติ
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

        {/* Pathology Cards */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {VET_PATHOLOGIES.map((pathItem) => {
            const media = pathItem.mediaId ? CANINE_MEDIA_CATALOG[pathItem.mediaId] : null;
            return (
              <div
                key={pathItem.id}
                className="rounded-2xl chai-card overflow-hidden flex flex-col justify-between hover:border-rose-500/50 transition"
              >
                <div>
                  {media && (
                    <div className="h-36 bg-slate-950 flex items-center justify-center p-1.5 relative">
                      <img
                        src={media.url}
                        alt={pathItem.nameTh}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain rounded"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                        {pathItem.severity}
                      </span>
                    </div>
                  )}

                  <div className="p-3.5 space-y-2">
                    <div>
                      <h3 className="text-sm font-extrabold chai-text-primary leading-snug">
                        {pathItem.nameTh}
                      </h3>
                      <div className="text-[11px] font-medium chai-text-muted">
                        {pathItem.nameEn}
                      </div>
                    </div>

                    <p className="chai-text-secondary leading-relaxed">
                      {pathItem.descriptionTh}
                    </p>

                    {pathItem.radiographicSigns && (
                      <div className="p-2 rounded-xl bg-sky-500/8 border border-sky-500/20 text-[11px]">
                        <span className="font-bold text-blue-700 dark:text-sky-300 flex items-center gap-1 mb-0.5">
                          <Activity className="w-3 h-3" />
                          <span>จุดสังเกตในภาพเอกซเรย์:</span>
                        </span>
                        <span className="chai-text-primary">{pathItem.radiographicSigns}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {pathItem.affectedBones.map((bId) => {
                        const bone = BONE_BY_ID[bId];
                        if (!bone) return null;
                        return (
                          <span
                            key={bId}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/70 dark:bg-slate-800 chai-text-primary"
                          >
                            {bone.nameTh}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <button
                    onClick={() => {
                      onSelectPathology(pathItem);
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>แยกแสดงกระดูกกลุ่มนี้ในโมเดล 3D</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
