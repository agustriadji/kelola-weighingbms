import { NextResponse } from "next/server";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // TODO: Replace with real database query
    const mockData = [
      {
        id: 'TRX-20250201-001',
        rfid: 'RFID001',
        vehicleNumber: 'BK 1234 AB',
        driverName: 'John Doe',
        driverId: 'DRV001',
        transporter: 'PT Angkut Jaya',
        documentType: 'DO',
        doNumber: 'DO-99281',
        material: 'CPO',
        sealNumber: 'SEAL001',
        sealCondition: 'OK',
        batchNumber: 'BATCH001',
        status: 'pending',
        createdAt: '2025-02-01T10:20:00Z',
      },
      {
        id: 'TRX-20250201-002',
        rfid: 'RFID002',
        vehicleNumber: 'BK 8890 ZZ',
        driverName: 'Jane Smith',
        driverId: 'DRV002',
        transporter: 'CV Lancar',
        documentType: 'SJ',
        sjNumber: 'SJ-5518',
        material: 'PKO',
        sealNumber: 'SEAL002',
        sealCondition: 'OK',
        batchNumber: 'BATCH002',
        status: 'approved',
        createdAt: '2025-02-01T09:50:00Z',
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockData,
      total: mockData.length
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}