import React, { useState } from 'react';
import { X, FileCode, Copy, Check } from 'lucide-react';

const BLENDER_PYTHON_SCRIPT = `# Blender Python Script: CHAi Canine Osteology GLB Exporter
# เปิดไฟล์ public/models/dog_skeletal.glb ใน Blender เพื่อปรับแต่ง แล้วรันสคริปต์นี้เพื่อ Export

import bpy

def export_chai_canine_glb(output_filepath="c:/xampp/htdocs/ana/public/models/dog_skeletal_custom.glb"):
    """Export โครงกระดูกสุนัขจาก Blender เป็น .glb พร้อม Vertex Colors (Ambient Occlusion)"""
    bpy.ops.export_scene.gltf(
        filepath=output_filepath,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True,
        export_materials='EXPORT',
        export_colors=True
    )
    print(f"Exported Canine Osteology GLB to: {output_filepath}")

if __name__ == "__main__":
    print("Loaded meshes:", [obj.name for obj in bpy.data.objects if obj.type == 'MESH'])
    # export_chai_canine_glb()
`;

export default function BlenderGuideModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(BLENDER_PYTHON_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl chai-panel overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-600 dark:text-sky-400 flex items-center justify-center border border-blue-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold chai-text-primary">
                การทำงานร่วมกับโปรแกรม Blender (.GLB / Meshopt)
              </h2>
              <p className="text-[11px] chai-text-secondary">
                โมเดลหลักอยู่ที่ <code>public/models/dog_skeletal.glb</code> (115 ชิ้นกระดูกแยกอิสระ)
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

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed">
          <div className="p-3.5 rounded-xl chai-card space-y-1.5">
            <h3 className="font-bold text-blue-600 dark:text-sky-400">
              1. มาตรฐานชื่อ Mesh ทั้ง 115 ชิ้นในโมเดลปัจจุบัน (NAV Convention)
            </h3>
            <p className="chai-text-secondary">
              ไฟล์สแกน 3D ในระบบแบ่งแยกชิ้นกระดูกออกเป็น 115 Meshes ตามมาตรฐานสัตวแพทย์ เช่น:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[10px] pt-1">
              <span className="p-1.5 rounded bg-slate-200/60 dark:bg-slate-800">dog_skeletal_skull</span>
              <span className="p-1.5 rounded bg-slate-200/60 dark:bg-slate-800">dog_skeletal_mandible</span>
              <span className="p-1.5 rounded bg-slate-200/60 dark:bg-slate-800">dog_skeletal_atlas</span>
              <span className="p-1.5 rounded bg-slate-200/60 dark:bg-slate-800">dog_skeletal_ribs_1_L..13_R</span>
              <span className="p-1.5 rounded bg-slate-200/60 dark:bg-slate-800">dog_skeletal_femur_L / _R</span>
              <span className="p-1.5 rounded bg-slate-200/60 dark:bg-slate-800">dog_skeletal_os-penis</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl chai-card space-y-1.5">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400">
              2. ลากวางไฟล์ .GLB บนหน้าจอได้ทันที (Live Drag & Drop)
            </h3>
            <p className="chai-text-secondary">
              หากคุณแก้ไขหรือปั้นชิ้นกระดูกเพิ่มเติมใน Blender แล้วสั่ง <strong>File &gt; Export &gt; glTF 2.0 (.glb)</strong> สามารถลากไฟล์ <code>.glb</code> มาวางทับบนพื้นที่ 3 มิติของหน้าเว็บได้โดยตรง ระบบรองรับทั้งไฟล์ปกติและไฟล์บีบอัด <code>EXT_meshopt_compression</code>
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold chai-text-primary">
                สคริปต์ Python สำหรับ Export จาก Blender:
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg chai-card font-semibold flex items-center gap-1.5 hover:border-blue-500/40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกสคริปต์'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] overflow-x-auto">
              {BLENDER_PYTHON_SCRIPT}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
