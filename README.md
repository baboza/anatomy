# CHAi Canine Osteology 3D Atlas (ระบบกายวิภาคโครงกระดูกสุนัข 3 มิติ)

เว็บแอปพลิเคชันกายวิภาคศาสตร์โครงสร้างกระดูกสุนัข 3 มิติ (*Canis lupus familiaris*) ออกแบบตามมาตรฐานคลินิกของ **`connecthuman.ai/atlas/` (CHAi Atlas)** พัฒนาด้วย **React 18 + Three.js / React Three Fiber + Tailwind CSS + Firebase Firestore**

> เอกสารสำรองข้อมูลสถาปัตยกรรม สเปกโมเดล 3D และตารางจับคู่ชิ้นกระดูกทั้ง 115 ชิ้น อยู่ที่ไฟล์ [`BACKUP_CANINE_ATLAS.md`](./BACKUP_CANINE_ATLAS.md)

---

## จุดเด่นหลักของระบบ (Current Milestone)

- **โมเดลสแกนกระดูกสุนัขจริง 115 ชิ้นแยกอิสระ (`public/models/dog_skeletal.glb`):** ถอดรหัสด้วย `MeshoptDecoder` พร้อมเงาหลืบกระดูก Ambient Occlusion (`COLOR_0`) และ BVH Raycasting ความเร็วสูง 60 FPS
- **ระบบกะโหลกสุนัขครบทั้ง 3 ประเภท (`Cephalic Types`):**
  - **Brachycephalic** *(Short, broad skull — กะโหลกสั้น-กว้าง `CI ~87` เช่น Pug, English/French Bulldog)*
  - **Mesocephalic** *(Medium, balanced skull — กะโหลกสมดุล `CI ~58` เช่น Labrador, Pointer, Beagle)*
  - **Dolichocephalic** *(Long, narrow skull — กะโหลกยาว-แคบ `CI ~41` เช่น Greyhound, Rough Collie, Borzoi)*
  - รองรับทั้ง **สลับรูปทรงกะโหลกสดบนโครงกระดูกสุนัขเต็มตัว 115 ชิ้น** และ **สตูดิโอเปรียบเทียบ 3 กะโหลกพร้อมกันแบบ 360°** พร้อมสไลเดอร์อ้าปาก `TMJ` และเส้นวัดดัชนีกะโหลก `CI`
- **เงาร่างผิวกายสุนัขโปร่งแสง (`public/models/dog_integumentary.glb`):** แสดงขอบเขตลำตัวและเล็บด้วย Fresnel Shader เพื่อเทียบตำแหน่งกระดูกภายในตัวสุนัข (ไม่มีกล้ามเนื้อและหลอดเลือด)
- **คลังภาพเอกซเรย์และแผนภาพอ้างอิง Wikimedia Commons (60 รายการ):** มีทั้งแผนภาพเวกเตอร์ในเครื่อง (`public/wiki/`) ฟิล์มเอกซเรย์คลินิกจริง ตัวอย่างกระดูกพิพิธภัณฑ์ และภาพพิมพ์ Sisson (1910) / Ellenberger (1908)
- **เครื่องมือศึกษา 3 มิติครบชุด:**
  - สไลเดอร์แยกชิ้นกระดูกทุกชิ้น (**Exploded View `0%–100%`**)
  - มีดตัดภาคตัดขวาง 3 มิติ (**Cross-Section Slicer** แกน `X`, `Y`, `Z`)
  - 4 โหมดเรนเดอร์: กระดูกจริง, เอกซเรย์ (`X-Ray`), แยกสีส่วน, และเส้นโครงตาข่าย
  - โหมดสีคลินิกสว่าง (**CHAi Light**) และโหมดห้องดูฟิล์มมืด (**Radiology Dark**)
  - ค้นหาด่วนด้วยปุ่มลัด `/` หรือ `Ctrl+K` เจาะลึกถึงระดับปล้องกระดูกสันหลังและซี่โครงรายซี่
  - บทเรียนชีวกลศาสตร์เชื่อมโยง 3 มิติ (**Connected Journeys**), คลินิกโรคกระดูก และแบบทดสอบ
- **พร้อมเชื่อมต่อ Firebase Firestore:** ทำงานออฟไลน์ผ่าน `LocalStorage` ได้สมบูรณ์ และรองรับการวาง Firebase Config เพื่อกด **Seed ข้อมูลทั้ง 31 โครงสร้าง (115 ชิ้นย่อย)** ขึ้น Firestore ในคลิกเดียว

---

## วิธีรันโปรเจกต์

```bash
cd c:\xampp\htdocs\ana
npm install
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173/`
