# CHAi Canine Osteology 3D Atlas — เอกสาร Backup สถาปัตยกรรมและมาตรฐานระบบ

> **วันที่บันทึก Backup:** 31 ตุลาคม 2026  
> **โฟลเดอร์โปรเจกต์:** `c:\xampp\htdocs\ana`  
> **ต้นแบบ UX/UI:** `https://www.connecthuman.ai/atlas/` (CHAi Human Atlas) ปรับแต่งสำหรับกายวิภาคศาสตร์สัตวแพทย์สุนัข (*Canis lupus familiaris*)  
> **ขอบเขตปัจจุบัน (Phase 1 + 3 Cephalic Types):** เฉพาะโครงสร้างกระดูกสุนัข (**31 หมวดมาตรฐาน NAV = 115 ชิ้นกระดูก 3 มิติแยกอิสระ**) + **ระบบกะโหลกสุนัขครบทั้ง 3 ประเภท (`Brachycephalic`, `Mesocephalic`, `Dolichocephalic`) ทั้งแบบสวมบนโครงกระดูกเต็มตัวและสตูดิโอเปรียบเทียบ 3 กะโหลกพร้อมกันแบบ 360°** + เงาร่างผิวกายสุนัขโปร่งแสง (ไม่มีกล้ามเนื้อและหลอดเลือด) + คลังภาพเอกซเรย์และแผนภาพอ้างอิง Wikimedia Commons 60 รายการ

---

## 0. กฎข้อบังคับการทำงานประจำโปรเจกต์ (Mandatory Workflow Rules — บันทึกตามคำสั่งผู้ใช้)

> กฎนี้บันทึกไว้ทั้งในไฟล์นี้และไฟล์ [`AGENTS.md`](./AGENTS.md) เพื่อให้ระบบโหลดบังคับใช้อัตโนมัติทุกครั้ง:

1. **เช็คบั๊กและทดสอบการรันผ่าน 100% ทุกครั้งหลังแก้ไขเสร็จ:**
   - ทุกครั้งหลังแก้โค้ดหรือปรับโมเดล 3D ต้องรันทดสอบ `npm run build` ให้ผ่าน `exit code 0`, ตรวจสอบความถูกต้องของ Buffer/Normals/Imports และทดสอบการโหลดจริงบน `http://localhost:5173/` (`HTTP 200 OK`) ให้มั่นใจว่าทำงานได้สมบูรณ์ 100% ก่อนแจ้งผล
2. **ห้าม `git push` จนกว่าจะได้รับคำสั่ง:**
   - **ไม่อนุญาตให้สั่ง `git push` ขึ้น GitHub โดยอัตโนมัติเด็ดขาด** ต้องรอจนกว่าผู้ใช้จะสั่งให้ `push git` อย่างชัดเจนเท่านั้น
3. **ตรวจสอบโควตา Firebase ไม่ให้มีความเสี่ยงเสียเงิน และใช้ทรัพยากรให้น้อยที่สุดเสมอ (Zero-Cost Spark Policy):**
   - ใช้ `firebase/firestore/lite` (REST-only ลดขนาด JS Bundle กว่า ~85% และตัดวงจร `onSnapshot` ถาวร), ยุบรวม Catalog ไว้ใน 1 เอกสาร (`1 Read/วัน` ด้วย `24h LocalStorage Cache`), ใช้ `Debounce 2.5s` + `Diff Check` ก่อนเขียนทุกครั้ง, มีตัวตัดวงจรโควตารายวัน (`Quota Circuit Breaker`) และห้ามเก็บไฟล์ `.glb`/รูปภาพบน Firebase Storage เด็ดขาด

---

## 1. มาตรฐานคุณภาพที่กำหนดไว้ (Core Quality Standard)

1. **ห้ามใช้รูปทรงเรขาคณิตพื้นฐาน (No Primitive Box/Cylinder/Sphere Geometry):**
   - ต้องใช้โมเดลสแกนกระดูกจริง (CT Scan / Photogrammetry / High-Detail Veterinary Sculpt) ที่แยกชิ้นกระดูกอิสระและมี **Baked Ambient Occlusion ใน Vertex Colors (`COLOR_0`)** เพื่อให้ร่องกระดูก รูเปิดเส้นประสาท (Foramina) สันกะโหลก และซี่ฟันคมชัดระดับพิพิธภัณฑ์
2. **เชื่อมโยงภาพอ้างอิงจริงจาก Wikimedia Commons เสมอ:**
   - ทุกโครงสร้างกระดูกต้องมีภาพประกอบอ้างอิงจริง ทั้งแผนภาพเวกเตอร์ (เก็บสำรองแบบ Offline ใน `public/wiki/`), ฟิล์มเอกซเรย์ทางคลินิก (Veterinary Radiographs), ตัวอย่างกระดูกจริงจากพิพิธภัณฑ์ และภาพพิมพ์ตำราสัตวแพทย์คลาสสิก (Sisson 1910, Ellenberger-Leisering 1908)
3. **สถาปัตยกรรม Dual-Mode (Offline LocalStorage + Cloud Firebase Firestore):**
   - ทำงานแบบออฟไลน์ได้สมบูรณ์ 100% ทันที และพร้อมรับ Firebase Configuration JSON ในภายหลังพร้อมปุ่ม **1-Click Seed** อัปโหลดข้อมูลทั้งหมดขึ้น Firestore

---

## 2. โครงสร้างไฟล์ทั้งหมดของโปรเจกต์ (File & Directory Map)

```text
c:\xampp\htdocs\ana\
├── index.html                              # หน้าหลัก กำหนดฟอนต์ Inter + Sarabun และ data-theme="light"
├── package.json                            # Dependencies: React 18, Three 0.170, R3F, Drei, Firebase 10, Tailwind
├── vite.config.js                          # ตั้งค่าพอร์ต 5173 และแยก Vendor Chunks (three, r3f-drei, firebase)
├── tailwind.config.js                      # ตั้งค่า darkMode: 'class' และชุดสีคลินิก
├── BACKUP_CANINE_ATLAS.md                  # เอกสาร Backup สถาปัตยกรรมและตารางอ้างอิงฉบับสมบูรณ์ (ไฟล์นี้)
├── README.md                               # คู่มือเริ่มต้นใช้งานโปรเจกต์
│
├── public\
│   ├── models\
│   │   ├── dog_skeletal.glb                # โมเดลหลักโครงกระดูกสุนัข 115 ชิ้น (4.6 MB, Meshopt + Vertex AO)
│   │   └── dog_integumentary.glb           # โมเดลผิวกายและเล็บสุนัขสำหรับทำเงาร่างโปร่งแสง (400 KB)
│   └── wiki\                               # แผนภาพ Wikimedia เก็บในเครื่อง (โหลดได้ทันทีแม้ไม่มีอินเทอร์เน็ต)
│       ├── dog_skeleton_diagram_th_en.svg  # แผนภาพเวกเตอร์โครงกระดูกสุนัขทั้งตัว
│       ├── dog_skeleton_diagram.png        # แผนภาพโครงกระดูกสุนัข PNG ความละเอียดสูง
│       ├── dog_skeleton_unlabeled.png      # แผนภาพโครงกระดูกสุนัขแบบไม่มีตัวอักษร (สำหรับทบทวน)
│       ├── dog_skull_diagram.svg           # แผนภาพแยกสีชิ้นกระดูกกะโหลกศีรษะสุนัข (SVG)
│       ├── dog_skull_diagram.png           # แผนภาพแยกสีชิ้นกระดูกกะโหลกศีรษะสุนัข (PNG)
│       ├── rvc_canine_skeleton_museum.png  # ภาพถ่ายโครงกระดูกจริง Royal Veterinary College Museum
│       ├── wolf_canid_skeleton_specimen.png# ภาพถ่ายโครงกระดูกตระกูลสุนัข (Canidae) พื้นหลังขาว
│       ├── cephalic_3types_dorsal_3d.png   # แผนภาพ 3D Dorsal เปรียบเทียบกะโหลกทั้ง 3 ประเภท
│       ├── cephalic_3types_lateral_3d.png  # แผนภาพ 3D Lateral เปรียบเทียบมุม Stop และการสบฟัน 3 ประเภท
│       └── selected_dog_skulls_comparison.jpg # ภาพถ่ายกะโหลกสุนัขจริง 6 สายพันธุ์จากพิพิธภัณฑ์ (Wikimedia)
│
└── src\
    ├── main.jsx                            # Entry point ของ React
    ├── index.css                           # ตัวแปรสี CSS สำหรับโหมดคลินิกสว่าง (CHAi Light) และโหมดห้องฟิล์มมืด (Dark)
    ├── App.jsx                             # ศูนย์กลาง State ทั้งหมด, คีย์ลัด '/', Drag & Drop .glb และเชื่อมต่อทุกหน้าต่าง
    │
    ├── utils\
    │   └── cephalicMorph.js                # เครื่องยนต์คำนวณรูปทรงกะโหลก 3 ประเภท (C-infinity Diffeomorphic Morphometry)
    │
    ├── data\
    │   ├── canineSkeletonData.js           # ฐานข้อมูลกระดูกสุนัข 31 หมวด NAV (ครบ 115 Meshes), รากศัพท์ และ 10 โรคกระดูก
    │   └── canineMediaData.js              # คลังภาพ Wikimedia/X-Ray 60 รายการ และบทเรียนเชื่อมโยง 3 มิติ 4 ชุด
    │
    ├── services\
    │   └── firebase.js                     # ระบบเชื่อมต่อ Firebase Firestore + LocalStorage Fallback + 1-Click Seed
    │
    └── components\
        ├── 3d\
        │   ├── CanineCanvas.jsx            # เวที Three.js, สลับโหมดโครงกระดูก 115 ชิ้น / โหมดเทียบ 3 กะโหลก
        │   ├── CanineSkeletonModel.jsx     # โหลด Meshopt GLB, Morph กะโหลก-กราม-โคนลิ้น-ผิวกายแบบสด, BVH Raycast
        │   ├── CephalicComparison3D.jsx    # สตูดิโอ 3D วางกะโหลกทั้ง 3 ประเภทเรียงคู่กัน + อ้าปาก TMJ + เส้นวัด CI
        │   ├── MeasurementOverlay3D.jsx    # ระบบไม้บรรทัดวัดระยะ 3D และเครื่องมือวัดมุมกระดูกทางคลินิกสัตวแพทย์ (ป้ายลอย 3D + เส้นวัด)
        │   └── CameraController.jsx        # ระบบบินกล้องนุ่มนวลทั้งโหมดโครงกระดูกเต็มตัวและโหมดเทียบ 3 กะโหลก
        │
        └── ui\
            ├── Header.jsx                  # แถบเมนูบนสไตล์ CHAi Atlas + ปุ่มลัดกะโหลก 3 ประเภท + สลับสี Light/Dark
            ├── CephalicControlBar.jsx      # แถบลอยสลับ Brachy/Meso/Dolichocephalic + แผงวิเคราะห์ดัชนีกะโหลกด้านขวา
            ├── MeasurementControlBar.jsx   # แผงควบคุมเครื่องมือวัดระยะและมุมกระดูกสัตว์แพทย์ (Norberg Angle, TPA, Inclination)
            ├── SearchCommandModal.jsx      # หน้าต่างค้นหาด่วน (กด '/' หรือ Ctrl+K) ค้นได้ถึงระดับปล้องกระดูกและซี่โครง
            ├── AnatomyHierarchyTree.jsx    # สารบัญกระดูกด้านซ้าย + แถบความก้าวหน้าการเรียน + มีดตัดภาคตัดขวาง 3D
            ├── BoneDetailPanel.jsx         # แผงข้อมูลด้านขวา 4 แท็บ + ตัวเลือกชิ้นย่อย + ตัวปรับความโปร่งแสงส่วนข้างเคียง
            ├── ViewerToolbar.jsx           # แถบควบคุมลอยด้านล่าง (Explode Slider, Render Modes, เงาลำตัว, ไม้บรรทัด 3D, มุมกล้อง)
            ├── WikiAtlasModal.jsx          # แกลเลอรีแผนภาพ Wikimedia และฟิล์มเอกซเรย์เต็มรูปแบบพร้อมลิงก์ชี้เป้า 3D
            ├── JourneysModal.jsx           # หน้าต่างเลือกบทเรียนชีวกลศาสตร์เชื่อมโยง 3 มิติ + แถบกำกับขั้นตอน
            ├── PathologyModal.jsx          # คลินิกโรคกระดูกและข้อสุนัขพร้อมฟิล์ม X-Ray เปรียบเทียบ
            ├── QuizModal.jsx               # ระบบแบบทดสอบความรู้กายวิภาคกระดูกสุนัข
            ├── AuthGateScreen.jsx          # หน้าจอยืนยันตัวตนก่อนเข้าใช้งาน (Google Auth + Email/Password)
            └── AdminDashboardView.jsx      # ศูนย์จัดการข้อมูล Admin เต็มหน้าจอ (Full-Page 5 แท็บ: ภาพรวม/กระดูก/โรค/ผู้ใช้/ตั้งค่า)
```

---

## 3. สเปกทางเทคนิคระบบ 3 มิติ และแกนพิกัดสัตวแพทย์ (3D Technical Spec)

### 3.1 การถอดรหัสไฟล์ GLB (`MeshoptDecoder` บังคับใช้เสมอ)
ไฟล์ `dog_skeletal.glb` และ `dog_integumentary.glb` บีบอัดด้วยส่วนขยาย `EXT_meshopt_compression` และ `KHR_mesh_quantization` ดังนั้นทุกครั้งที่ใช้ `GLTFLoader` ต้องผูก `MeshoptDecoder` ดังนี้:

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
```

### 3.2 ระบบพิกัดกายวิภาคของโมเดล (`dog_skeletal.glb`)
- **ขอบเขตพิกัดดิบ (Raw Bounds):** `X: [-0.094, 0.094]`, `Y: [0.001, 0.634]`, `Z: [-0.429, 0.380]`
- **ค่าปรับขนาดในฉาก (`CanineSkeletonModel.jsx`):** `MODEL_SCALE = 3.8`, `MODEL_Y_OFFSET = -1.14`
- **ทิศทางมาตรฐานสัตวแพทย์:**
  - **`-Z`** = **Cranial / Rostral** (ด้านหัว / ด้านหน้า)
  - **`+Z`** = **Caudal** (ด้านหาง / ด้านท้าย)
  - **`+Y`** = **Dorsal** (ด้านหลังบน)
  - **`-Y`** = **Ventral** (ด้านท้อง / ฝ่าเท้าวางที่ระนาบพื้น)
  - **`-X`** = **Left (`_L`)** (ซีกซ้ายของตัวสุนัข)
  - **`+X`** = **Right (`_R`)** (ซีกขวาของตัวสุนัข)

### 3.3 ระบบวัสดุและ Shaders
1. **กระดูกจริง (`natural`):** `THREE.MeshPhysicalMaterial` สีงาช้างแห้ง (`#f6f0e2` / `#f1ead8`), `roughness: 0.73`, `clearcoat: 0.08`, เปิด `vertexColors: true` เพื่อดึงเงาหลืบกระดูก Ambient Occlusion ที่อบฝังไว้ในเมชออกมาแสดงผล
2. **เอกซเรย์คลินิก (`xray`):** Custom GLSL Fresnel Shader คำนวณมุมตกกระทบสายตา `pow(1.0 - abs(dot(N, V)), 1.75)` ให้ขอบผนังกระดูกทึบ (Cortical wall) สว่างคมเหมือนฟิล์มเอกซเรย์จริง
3. **เงาร่างผิวกายสุนัข (`dog_integumentary_skin`):** แสดงเฉพาะ `dog_integumentary_skin` และ `dog_integumentary_claws_L/R` (ซ่อน `eyes_L/R`) และกำหนด `child.raycast = () => null` เพื่อไม่ให้บังการคลิกเลือกกระดูกด้านใน

### 3.4 ระบบกะโหลกสุนัขครบทั้ง 3 ประเภท (`src/utils/cephalicMorph.js` & `CephalicComparison3D.jsx`)
จำแนกตามดัชนีกะโหลกมาตรฐานสัตวแพทย์ $\text{Cephalic Index (CI)} = \frac{\text{Bizygomatic Width}}{\text{Total Skull Length}} \times 100$ (แก้ไขคำบรรยายภาษาอังกฤษที่สลับกันในโปสเตอร์ทั่วไปให้ถูกต้องตามหลักกายวิภาคศาสตร์ 100%):

| ประเภทกะโหลก | คำจำกัดความทางสัตวแพทย์ที่ถูกต้อง | ดัชนี CI | จุดเด่นทางโครงสร้างกระดูกและการสบฟัน | สายพันธุ์ตัวอย่าง |
| :--- | :--- | :---: | :--- | :--- |
| **1. Brachycephalic** | **Short, broad skull** (กะโหลกสั้น-กว้าง / พันธุ์หน้าสั้น) | `80 – 100+` (`~86.8`) | ขากรรไกรบนและจมูกหดสั้น โหนกแก้มกางกว้าง มุมดั้งจมูก (Stop) หักชัน เบ้าตาตื้น ขากรรไกรล่างยื่นครอบบน (Undershot / Mandibular Prognathism) | Pug, English Bulldog, French Bulldog, Pekingese, Boston Terrier |
| **2. Mesocephalic** | **Medium, balanced skull** (กะโหลกสมดุลปานกลาง) | `50 – 65` (`~57.5`) | สัดส่วนกล่องสมองสมดุลกับใบหน้า (~1:1) มุม Stop ปานกลาง สบฟันแบบกรรไกรมาตรฐาน (Scissor Bite) | Labrador, Golden Retriever, Pointer, Beagle, Fox Terrier |
| **3. Dolichocephalic** | **Long, narrow skull** (กะโหลกยาว-แคบ / พันธุ์หน้ายาว) | `< 50` (`~37.4–42`) | กระดูกจมูกและขากรรไกรบนยืดยาวเรียวแคบ โหนกแก้มเพรียวแนบกะโหลก สันกลางกะโหลก (Sagittal crest) เด่นชัด มุม Stop ลาดเรียบ | Greyhound, Afghan Hound, Rough Collie, Borzoi, Saluki |

- **เทคนิคคณิตศาสตร์ 3 มิติ (`deformCephalicScenePoint` & `prepareMorphableGeometry`):** ต้องแปลงทั้ง `position` (`Int16Array`), `normal` (`Int8Array` Interleaved) และ `color` (`Uint8Array`) เป็น `Float32BufferAttribute` แยกอิสระเสมอ **ห้ามเรียก `computeVertexNormals()` ทับ `Int8Array` โดยตรงเด็ดขาด** (เพราะ Three.js จะเขียนค่าทศนิยม `[-1, 1]` ลง `Int8Array` จนถูกปัดเป็น `[0, 0, 0]` ทำให้ Shader คำนวณแสงเป็นสีดำสนิท) จากนั้นจึงคำนวณการยืด/หดตามแกนระนาบเพดานปากจริง (`20°` Palatal-Rostral Axis) ด้วยฟังก์ชันปริพันธ์ $C^\infty$ Monotonic (`integratedStep`) พร้อมล็อกจุดหมุน `Atlanto-occipital joint` (`Atlas C1`) และ `TMJ` ให้แนบสนิท 100%

---

## 4. ตารางจับคู่โครงสร้างกระดูกทั้ง 31 หมวด NAV = 115 ชิ้นโมเดล 3D

| ลำดับ | รหัส `id` | ชื่อภาษาไทย | ชื่อละติน (NAV) | ชื่อ Mesh ใน `dog_skeletal.glb` | จำนวนชิ้น |
| :--- | :--- | :--- | :--- | :--- | :---: |
| 1 | `skull` | กะโหลกศีรษะ | *Cranium* | `dog_skeletal_skull` | 1 |
| 2 | `mandible` | กระดูกขากรรไกรล่าง | *Mandibula* | `dog_skeletal_mandible` | 1 |
| 3 | `hyoid` | ชุดกระดูกโคนลิ้น | *Apparatus hyoideus* | `dog_skeletal_hyoid` | 1 |
| 4 | `atlas` | กระดูกคอชิ้นที่ 1 (C1) | *Atlas* | `dog_skeletal_atlas` | 1 |
| 5 | `axis` | กระดูกคอชิ้นที่ 2 (C2) | *Axis* | `dog_skeletal_axis` | 1 |
| 6 | `vertebrae-cervical` | กระดูกคอชิ้นที่ 3–6 | *Vertebrae cervicales III–VI* | `dog_skeletal_vertebrae-cervical_c3` ถึง `_c6` | 4 |
| 7 | `vertebra-c7` | กระดูกคอชิ้นที่ 7 (C7) | *Vertebra cervicalis VII* | `dog_skeletal_vertebra-c7` | 1 |
| 8 | `vertebrae-thoracic` | กระดูกสันหลังอก T1–T13 | *Vertebrae thoracicae* | `dog_skeletal_vertebrae-thoracic_t1` ถึง `_t13` | 13 |
| 9 | `vertebra-l1` | กระดูกสันหลังเอว L1 | *Vertebra lumbalis I* | `dog_skeletal_vertebra-l1` | 1 |
| 10 | `vertebrae-lumbar` | กระดูกสันหลังเอว L2–L7 | *Vertebrae lumbales II–VII* | `dog_skeletal_vertebrae-lumbar_l2` ถึง `_l7` | 6 |
| 11 | `sacrum` | กระดูกกระเบนเหน็บ | *Os sacrum* | `dog_skeletal_sacrum` | 1 |
| 12 | `vertebrae-caudal` | กระดูกสันหลังหาง Cd1–Cd19 | *Vertebrae caudales* | `dog_skeletal_vertebrae-caudal_cd1` ถึง `_cd19` | 19 |
| 13 | `ribs` | กระดูกซี่โครง 13 คู่ | *Costae I–XIII* | `dog_skeletal_ribs_1_L/R` ถึง `_13_L/R` | 26 |
| 14 | `manubrium` | ด้ามกระดูกอก | *Manubrium sterni* | `dog_skeletal_manubrium` | 1 |
| 15 | `sternum` | ตัวกระดูกอกและลิ้นปี่ | *Corpus sterni & Xiphoid* | `dog_skeletal_sternum_s2`..`_s7`, `_xiphoid` | 7 |
| 16 | `scapula` | กระดูกสะบัก | *Scapula* | `dog_skeletal_scapula_L`, `_R` | 2 |
| 17 | `humerus` | กระดูกต้นขาหน้า | *Humerus* | `dog_skeletal_humerus_L`, `_R` | 2 |
| 18 | `radius` | กระดูกปลายขาหน้าชิ้นใน | *Radius* | `dog_skeletal_radius_L`, `_R` | 2 |
| 19 | `ulna` | กระดูกปลายขาหน้าชิ้นนอก | *Ulna* | `dog_skeletal_ulna_L`, `_R` | 2 |
| 20 | `carpus` | กลุ่มกระดูกข้อมือ | *Ossa carpi* | `dog_skeletal_carpus_L`, `_R` | 2 |
| 21 | `metacarpus` | กระดูกฝ่าเท้าหน้า | *Ossa metacarpalia* | `dog_skeletal_metacarpus_L`, `_R` | 2 |
| 22 | `phalanges-thoracic` | กระดูกนิ้วเท้าหน้า | *Ossa digitorum manus* | `dog_skeletal_phalanges-thoracic_L`, `_R` | 2 |
| 23 | `os-coxae` | กระดูกเชิงกราน | *Os coxae* | `dog_skeletal_os-coxae_L`, `_R` | 2 |
| 24 | `femur` | กระดูกต้นขาหลัง | *Os femoris* | `dog_skeletal_femur_L`, `_R` | 2 |
| 25 | `patella` | กระดูกสะบ้า | *Patella* | `dog_skeletal_patella_L`, `_R` | 2 |
| 26 | `tibia` | กระดูกหน้าแข้ง | *Tibia* | `dog_skeletal_tibia_L`, `_R` | 2 |
| 27 | `fibula` | กระดูกน่อง | *Fibula* | `dog_skeletal_fibula_L`, `_R` | 2 |
| 28 | `tarsus` | กลุ่มกระดูกข้อเท้า (Hock) | *Ossa tarsi* | `dog_skeletal_tarsus_L`, `_R` | 2 |
| 29 | `metatarsus` | กระดูกฝ่าเท้าหลัง | *Ossa metatarsalia* | `dog_skeletal_metatarsus_L`, `_R` | 2 |
| 30 | `phalanges-pelvic` | กระดูกนิ้วเท้าหลัง | *Ossa digitorum pedis* | `dog_skeletal_phalanges-pelvic_L`, `_R` | 2 |
| 31 | `os-penis` | กระดูกองคชาต | *Os penis (Baculum)* | `dog_skeletal_os-penis` | 1 |
| **รวม** | **31 โครงสร้าง** | | | **ครบ 100% ไม่มี Mesh ตกหล่น** | **115** |

---

## 5. โครงสร้างระบบยืนยันตัวตน ผู้ดูแลระบบ (`jirawat.s@msu.ac.th`) และโฮสต์จริง (`anatomy-568be`)

- **Production Host:** `https://anatomy-568be.web.app` และ `https://anatomy-568be.firebaseapp.com` (Project ID: `anatomy-568be`)
- **ระบบยืนยันตัวตนก่อนเข้าใช้งาน (`AuthGateScreen.jsx`):** บังคับ Login ก่อนเข้าดู Atlas รองรับทั้ง **Google Sign-In (`@msu.ac.th` / Gmail)** และ **Email/Password** (ฟรี `\$0` สูงสุด 50,000 MAUs)
- **Super Admin หลักถาวร:** **`jirawat.s@msu.ac.th`** ได้รับสิทธิ์ `SUPER ADMIN` โดยอัตโนมัติทั้งฝั่งไคลเอนต์และบังคับสิทธิ์ใน `firestore.rules` พร้อมหน้า **ศูนย์จัดการข้อมูลผู้ดูแลระบบแบบเต็มหน้าจอ (`AdminDashboardView.jsx`)** ครบ 5 แท็บ:
  1. ภาพรวมระบบ โควตา และการสำรอง/นำเข้าไฟล์ `.JSON`
  2. แก้ไขข้อมูลกระดูกทั้ง 31 โครงสร้าง (ชื่อ คำอธิบาย ปุ่มกระดูก ข้อต่อ โน้ตคลินิก และลิงก์รูปภาพเพิ่มเติม)
  3. เพิ่ม / แก้ไข / ลบ รายการโรคกระดูกทางคลินิก (`Pathologies CRUD`) พร้อมผูกชิ้นกระดูก 3D
  4. จัดการรายชื่อผู้ใช้งาน แต่งตั้ง Admin ร่วมล่วงหน้าตามอีเมล (`Pre-authorize Email`) และระงับบัญชี
  5. ตั้งค่าชื่อระบบ แถบประกาศข่าวสารหน้าเว็บ และโหมดปิดปรับปรุงชั่วคราว

### คอลเลกชันใน Firestore (สถาปัตยกรรมประหยัดโควตาสูงสุด — Ultra-Low Quota):
- `canine_atlas_meta/catalog_v2` (**1 เอกสารรวมศูนย์ ~138 KB**) — รวมข้อมูลทั้ง 31 โครงสร้าง (115 ชิ้นย่อย), โรคกระดูก และการตั้งค่าหน้าเว็บไว้ในเอกสารเดียว บันทึกใช้เพียง **1 Write** และเปิดเว็บดึงข้อมูลใช้เพียง **1 Read ต่อ 24 ชั่วโมง**
- `canine_atlas_meta/users_registry_v1` (**1 เอกสารรวมรายชื่อผู้ใช้และสิทธิ์**) — ทำให้หน้าจัดการผู้ใช้ของ Admin โหลดรายชื่อทั้งหมดด้วยโควตาเพียง **1 Read**
- `canine_user_state/{uid}` (**1 เอกสารต่อบัญชีผู้ใช้**) — รวมบันทึกช่วยจำ (`notes`), รายการปักหมุด (`bookmarkedBoneIds`) และรายการเรียนแล้ว (`studiedBoneIds`) พร้อมระบบ `Debounce 2.5 วินาที` + `Diff Check` + `Daily Quota Circuit Breaker`

---

## 6. คำสั่งรันระบบ และแผนต่อยอดเฟสถัดไป (Commands & Roadmap)

### คำสั่งใช้งานประจำ
```bash
# เข้าโฟลเดอร์โปรเจกต์
cd c:\xampp\htdocs\ana

# รันเซิร์ฟเวอร์พัฒนา (http://localhost:5173/)
npm run dev

# สร้างไฟล์ Production สำหรับขึ้นโฮสติ้ง / Firebase Hosting (ออกที่โฟลเดอร์ dist/)
npm run build
```

### แนวทางขยายระบบในอนาคต (เมื่อต้องการเพิ่มระบบอื่นนอกเหนือจากกระดูก)
- ใช้พิกัดและสเกลเดียวกัน (`MODEL_SCALE = 3.8`, `MODEL_Y_OFFSET = -1.14`, `MeshoptDecoder`) เพื่อให้โมเดลชั้นใหม่ซ้อนทับกับโครงกระดูก `dog_skeletal.glb` ได้สนิท 100%:
  - **Phase 2 (Arthrology):** เพิ่มเอ็นยึดข้อต่อสำคัญ (เช่น Cranial cruciate ligament, Nuchal ligament, Intervertebral discs)
  - **Phase 3 (Myology):** เพิ่มชั้นกล้ามเนื้อสุนัขแยกมัด พร้อมจุดเกาะต้น-เกาะปลาย (Origin & Insertion) บนปุ่มกระดูกที่มีอยู่ใน `canineSkeletonData.js`
  - **Phase 4 (Angiology & Neurology):** เพิ่มหลอดเลือดและข่ายประสาท (Brachial & Lumbosacral plexus)
