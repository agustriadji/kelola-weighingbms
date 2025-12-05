```
saya sedang mengembangkan project wbms (Weighing Balance Management System), project ini berbasih web apps dengan nextjs+tailwindcss+radix-ui,clsx.
Frontend dan Backend di kerjakan disini.


untuk document ada disini, anda bisa membacara terlebih dahulu :
- docs\PoC.md
- docs\development-roadmap.md
- docs\batch-workflow-complete.md

sebelum ya saya buat dalam 1 proses all in one.
ini akan di pecah ke beberapa pos, jadi ada 3 pos dan di isi oleh 1 operator.

Secara **standar operasional WBMS (Weighbridge Management System)** di industri (Pabrik CPO, Kernel, PKS, Palm Oil Mill, Tanker, Logistic, Mining, Manufacture) alurnya memang seperti ini:

---

Berikut **urutan tahapan** yang umum dipakai:

---

# **1️⃣ POS INBOUND (Security / Gate 1)**

Truck baru tiba dari luar pabrik → dilakukan:

* Scan RFID / input manual
* Verifikasi identitas truck
* Verifikasi driver
* Verifikasi dokumen (DO / PO / DN / SJ)
* Pencatatan tujuan & status barang (Empty / Loaded)
* Pengecekan fisik (seal, leakage, door lock)
* Foto CCTV (vehicle incoming)

📌 Output:
**Inbound Transaction Created → Truck diizinkan ke Weighbridge**

Ini **yang sedang kita bangun saat ini**.

---

# **2️⃣ POS WEIGH-IN (Timbangan 1 – Loaded Weight / Brutto)**

Truck naik ke timbangan:

* Gate control (enter → close)
* Capture weight indicator (via RS232)
* Capture CCTV (atas, samping)
* Validasi truck stop & stable
* Ambil **Bruto Weight**
* Simpan hasil ke transaksi inbound

📌 Output:
**Brutto Weight recorded → Truck diarahkan ke unloading / storage**

---

# **3️⃣ POS WEIGH-OUT (GATE 2 – Empty Weight / Tare) + OUTBOUND (Security / Gate 2)**

Setelah unloading:

* Truck naik lagi ke jembatan timbang
* Capture CCTV
* Validasi stable & stop
* Ambil **Tarra Weight**
* Hitung **Netto = Brutto – Tarra**
* Finalisasi transaksi

Truck menuju keluar → proses akhir:
* Verifikasi data final
* Cek dokumen keluar (Delivery Slip / Final Ticket)
* Foto akhir CCTV
* Netto real bisa dihitung, mendapatkan nilai susut neto
* Gate open → Truck keluar pabrik

📌 Output:
**Netto Weight Generated → Truck siap keluar**
**Transaction Closed (Outbound)**

---

# 🎯 **Kesimpulan Alur**

Benar → alurnya seperti ini:

```

POS 1 : Inbound
POS 2 : Weigh-In (Brutto)
POS 3 : Weigh-Out (Tarra) + Outbound

```

```
