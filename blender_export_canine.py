"""
=============================================================================
Blender Python Script: CHAi Canine Osteology 3D Atlas Exporter (115 Meshes)
=============================================================================
คู่มือการใช้งาน:
1. เปิดโปรแกรม Blender แล้ว Import ไฟล์ C:/xampp/htdocs/ana/public/models/dog_skeletal.glb
   (หรือเปิดไฟล์โมเดลกระดูกสุนัขที่ต้องการแก้ไข)
2. ไปที่แท็บ Scripting > กด New > วางสคริปต์นี้
3. กด Run Script เพื่อตรวจสอบชื่อ Mesh ทั้ง 115 ชิ้นตามมาตรฐาน NAV และส่งออกไฟล์ .glb
=============================================================================
"""

import bpy
import os

# คำนำหน้าชื่อ Mesh มาตรฐานทั้ง 31 หมวด NAV ใน CHAi Canine Atlas
NAV_MESH_PREFIXES = [
    "dog_skeletal_skull",
    "dog_skeletal_mandible",
    "dog_skeletal_hyoid",
    "dog_skeletal_atlas",
    "dog_skeletal_axis",
    "dog_skeletal_vertebrae-cervical_",
    "dog_skeletal_vertebra-c7",
    "dog_skeletal_vertebrae-thoracic_",
    "dog_skeletal_vertebra-l1",
    "dog_skeletal_vertebrae-lumbar_",
    "dog_skeletal_sacrum",
    "dog_skeletal_vertebrae-caudal_",
    "dog_skeletal_ribs_",
    "dog_skeletal_manubrium",
    "dog_skeletal_sternum_",
    "dog_skeletal_scapula_",
    "dog_skeletal_humerus_",
    "dog_skeletal_radius_",
    "dog_skeletal_ulna_",
    "dog_skeletal_carpus_",
    "dog_skeletal_metacarpus_",
    "dog_skeletal_phalanges-thoracic_",
    "dog_skeletal_os-coxae_",
    "dog_skeletal_femur_",
    "dog_skeletal_patella_",
    "dog_skeletal_tibia_",
    "dog_skeletal_fibula_",
    "dog_skeletal_tarsus_",
    "dog_skeletal_metatarsus_",
    "dog_skeletal_phalanges-pelvic_",
    "dog_skeletal_os-penis",
]


def export_to_atlas(output_path="C:/xampp/htdocs/ana/public/models/dog_skeletal_custom.glb"):
    """ส่งออกเป็นไฟล์ GLB พร้อม Vertex Colors (Baked Ambient Occlusion)"""
    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    print(f"พบวัตถุ Mesh ทั้งหมด: {len(mesh_objects)} ชิ้น")

    matched_count = 0
    for obj in mesh_objects:
        if any(obj.name.startswith(prefix) for prefix in NAV_MESH_PREFIXES):
            matched_count += 1
        else:
            print(f"  [!] วัตถุ '{obj.name}' ไม่ได้ขึ้นต้นด้วยคำนำหน้ามาตรฐาน NAV")

    print(f"จับคู่ชื่อมาตรฐานสำเร็จ: {matched_count}/{len(mesh_objects)} ชิ้น")

    export_dir = os.path.dirname(output_path)
    if export_dir and not os.path.exists(export_dir):
        os.makedirs(export_dir, exist_ok=True)

    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format="GLB",
        use_selection=False,
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
        export_colors=True,
    )
    print(f"ส่งออกโมเดลสำเร็จเรียบร้อย: {output_path}")


if __name__ == "__main__":
    export_to_atlas()
