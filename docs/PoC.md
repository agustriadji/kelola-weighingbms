**layered architecture** dengan separation of concerns:

---

## 🧩 Scope & Struktur Modular WBMS

### 1. **Messaging Layer**
- **MQTT Broker**
  - Semua data sensor/hardware masuk lewat topic yang terstruktur.
  - Contoh: `/indicator-box` (float weight), `/rfid`, `/gate/status`, `/cctv/event`.
  - Delay 1000ms untuk load cell → cukup granular untuk audit tanpa overload.

---

### 2. **Core Hardware Integration**
- **Indicator Box (RS232 → NodeSerial → MQTT)**
  - Command set modular → bisa di-*refactor* sebagai helper routine.
- **RFID Integration**
  - Capture vehicle/supplier identity.
- **Gate & CCTV API**
  - Event-driven → open/close gate, capture snapshot, log ke audit trail.

---

### 3. **Core System Modules**
- **Ongoing** → kendaraan yang sedang dalam proses timbang.
- **Raw Material** → inbound flow (supplier → weigh-in → unload).
- **Outgoing** → outbound flow (warehouse → weigh-out → delivery).
- Semua modul ini hanya *state machine* kendaraan/material, tidak perlu tahu transaksi SAP.

---

### 4. **SAP Integration Layer**
- **BullMQ Sync Audit**
  - Queue-based sync → robust terhadap SAP downtime.
- **Cronjob Master Data**
  - Periodic pull supplier/material master dari SAP.
- **Exec SAP API**
  - Default → langsung push data timbang ke SAP.
  - Fallback → jika error, data tetap aman di audit log WBMS, lalu retry.

---

### 5. **Security & Access**
- **RBAC Module**
  - Role-based → operator, supervisor, auditor.
  - Audit trail: siapa melakukan weigh-in/out, siapa approve.

---

### 6. **UI/BE Layer**
- **Next.js**
  - Frontend: dashboard weighbridge, vehicle queue, audit log.
  - Backend: handle Core System + SAP module API.
  - Modular → UI tetap jalan walau SAP error, karena data disimpan di WBMS dulu.

---

## 📊 Scope Data yang Harus Disiapkan
WBMS cukup siapkan **data minimal untuk audit & sync ke SAP**:
- **Surat Jalan/DO/PO number**
- **Vehicle ID / RFID**
- **Supplier ID**
- **Material ID**
- **Gross/Tare/Net weight**
- **Event log (timestamp, operator, gate, cctv snapshot)**

---

## 🔄 Prinsip Modular Scope
- **WBMS = data capture & audit trail**  
- **SAP = business logic & inventory movement**  
- WBMS tidak bergantung pada SAP, tapi tetap siap sync bila SAP available.  
- Semua modul berdiri sendiri, bisa di-*refactor* atau diganti tanpa ganggu sistem lain.  

