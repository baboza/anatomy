# กฎเหล็กการทำงานของโปรเจกต์ (Mandatory Workspace Rules — CHAi Canine Osteology Atlas)

กฎข้อบังคับนี้มีผลบังคับใช้ทุกครั้งที่มีการแก้ไขหรือพัฒนาโปรเจกต์ใน `c:\xampp\htdocs\ana`:

## 1. ห้าม `git push` โดยพลการเด็ดขาด (Strict No-Auto-Push Policy)
- **ไม่อนุญาตให้รันคำสั่ง `git push` เด็ดขาด** ไม่ว่าจะแก้ไขโค้ดเสร็จ สร้างฟีเจอร์ใหม่ หรือแก้ไขบั๊กเสร็จแล้วก็ตาม
- จะอนุญาตให้รัน `git push` ไปยัง GitHub (`https://github.com/baboza/anatomy`) **เฉพาะเมื่อผู้ใช้พิมพ์สั่งให้ push อย่างชัดเจนในข้อความนั้นเท่านั้น**

## 2. ต้องตรวจเช็คบั๊กและยืนยันว่ารันผ่าน 100% ทุกครั้งหลังแก้ไขเสร็จ (Mandatory 100% Verification Before Completion)
ทุกครั้งที่แก้ไขโค้ด โมเดล 3D หรือข้อมูลเสร็จ **ห้ามส่งงานทันทีโดยไม่ทดสอบ** ต้องตรวจสอบครบทุกข้อดังนี้ก่อนแจ้งผู้ใช้เสมอ:
1. **ตรวจสอบ Production Build (`npm run build`):** ต้องคอมไพล์ผ่าน `100%` (`exit code 0`) ไม่มี Syntax Error, Import Error หรือ Module ตกหล่น
2. **ตรวจสอบความถูกต้องของ 3D WebGL / Three.js Buffers:**
   - ไฟล์ `.glb` ที่ใช้ `EXT_meshopt_compression` + `KHR_mesh_quantization` ต้องผูก `MeshoptDecoder` เสมอ
   - หากมีการปรับรูปทรงเมชหรือคำนวณแสงใหม่ (`computeVertexNormals()`) **ต้องแปลง `position`, `normal`, และ `color` เป็น `Float32BufferAttribute` ก่อนเสมอ** ห้ามเขียนทับ `Int8Array` / `Int16Array` โดยตรงเพื่อป้องกันบั๊กโมเดลสีดำ (`[0, 0, 0]` normals)
3. **ตรวจสอบเซิร์ฟเวอร์จริง (`http://localhost:5173/`):** ยืนยันว่า Dev Server ตอบกลับสถานะ `HTTP 200 OK` ครบทั้งหน้าหลัก โมดูลที่แก้ไข และไฟล์สื่อ/โมเดลที่เกี่ยวข้อง

## 3. กฎป้องกันค่าใช้จ่ายและบีบอัดทรัพยากร Firebase สูงสุด (Firebase Zero-Cost & Minimum-Quota Policy)
ทุกครั้งที่แตะหรือเพิ่มฟีเจอร์เกี่ยวกับ Firebase / Firestore ต้องตรวจสอบความเสี่ยงเรื่องค่าใช้จ่ายและบังคับใช้มาตรฐานประหยัดทรัพยากรสูงสุดเสมอ (อยู่ภายใต้แผนฟรี **Firebase Spark Plan $0** แบบ 100%):
1. **ห้ามใช้ `onSnapshot` (Real-time Listeners) โดยไม่จำเป็นเด็ดขาด** เพื่อป้องกันการถูกคิดโควตา Read ซ้ำซ้อนทุกครั้งที่เปิดแท็บค้างไว้หรือเน็ตหลุดต่อใหม่
2. **ยุบรวมเอกสาร (Single-Document Aggregation) + แคชในเครื่อง 24 ชม. (`LocalStorage TTL Cache`):**
   - ข้อมูลโครงสร้างกระดูกทั้ง 31 หมวดและโรคกระดูก เก็บรวมใน 1 เอกสารเดียว (`canine_atlas_meta/catalog_v2` = เสียเพียง `1 Read` แทนที่จะเป็น `41 Reads` และแคชในเครื่อง `24 ชั่วโมง` ทำให้รีเฟรชหน้าเว็บซ้ำเสีย `0 Reads`)
   - สถานะของผู้เรียน (โน้ต + ปักหมุด + เรียนแล้ว) รวมไว้ใน 1 เอกสารต่อเครื่อง (`canine_user_state/{deviceId}`)
3. **หน่วงเวลารวมกลุ่มการเขียน (`Write Debouncing ≥ 2.5s`) + เช็คข้อมูลซ้ำ (`Diff Check`) + ตัวตัดวงจรรายวัน (`Daily Client Quota Circuit Breaker`):**
   - บันทึกลง `LocalStorage` ทันที แต่หน่วงเวลาซิงก์ขึ้น Firestore เพื่อยุบรวมการคลิกรัวๆ เหลือเพียง `1 Write` และข้ามการเขียนทันทีถ้าข้อมูลไม่เปลี่ยน
   - บังคับเพดานความปลอดภัยฝั่งไคลเอนต์ (`MAX_DAILY_READS_PER_CLIENT = 10`, `MAX_DAILY_WRITES_PER_CLIENT = 40`) หากเกิด Loop ผิดปกติต้องตัดเข้าโหมดออฟไลน์อัตโนมัติทันที
4. **ใช้ `firebase/firestore/lite` + `firebase/auth` (เฉพาะผู้ให้บริการฟรี Google & Email/Password — ห้ามใช้ SMS Auth ที่เสียเงิน) และห้ามนำไฟล์โมเดล 3D `.glb` ไปฝากบน Firebase Cloud Storage:**
   - ใช้ `firebase/firestore/lite` (REST-only ไม่มี WebSocket ค้าง) ร่วมกับ `firebase/auth` (ฟรีสูงสุด 50,000 MAUs/เดือน) โดยตั้ง `jirawat.s@msu.ac.th` เป็น Super Admin ถาวรทั้งฝั่งแอปและใน `firestore.rules`
   - เสิร์ฟโมเดล `.glb` และภาพประกอบเป็น Static Assets พร้อม Cache-Control คู่กับ Firebase Hosting (`anatomy-568be.web.app`) เพื่อประหยัด Bandwidth สูงสุด

## 4. ขอบเขตเนื้อหาและมาตรฐานคุณภาพ
- แสดงเฉพาะ **โครงสร้างกระดูกสุนัข (Canine Skeletal System — 115 ชิ้นกระดูก 3 มิติ + กะโหลกครบทั้ง 3 ประเภท: Brachycephalic, Mesocephalic, Dolichocephalic)** และเงาร่างผิวกายโปร่งแสงเท่านั้น (ไม่ใส่กล้ามเนื้อและหลอดเลือด เว้นแต่ผู้ใช้จะสั่งในอนาคต)
- อัปเดตเอกสารสำรองใน `BACKUP_CANINE_ATLAS.md` ให้ตรงกับสถานะล่าสุดของโปรเจกต์เสมอ
