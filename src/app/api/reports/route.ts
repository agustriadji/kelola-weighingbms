import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/database/client";
import { Batch } from "@/entities/Batch.entity";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const db = await getDb();
    const batchRepo = db.getRepository(Batch);
    
    let query = batchRepo.createQueryBuilder('batch')
      .leftJoinAndSelect('batch.vehicle', 'vehicle')
      .leftJoinAndSelect('batch.supplier', 'supplier')
      .leftJoinAndSelect('batch.material', 'material')
      .leftJoinAndSelect('batch.createdBy', 'user')
      .where('batch.status = :status', { status: 'finished' });
    
    if (startDate) {
      query = query.andWhere('batch.startedAt >= :startDate', { startDate });
    }
    
    if (endDate) {
      query = query.andWhere('batch.endedAt <= :endDate', { endDate });
    }
    
    const batches = await query
      .orderBy('batch.endedAt', 'DESC')
      .getMany();
    
    const report = batches.map(batch => ({
      id: batch.id,
      batchName: batch.batchName,
      vehicle: batch.vehicle?.plate,
      supplier: batch.supplier?.name,
      material: batch.material?.description,
      operator: batch.createdBy?.fullName,
      startedAt: batch.startedAt,
      endedAt: batch.endedAt,
      duration: batch.endedAt && batch.startedAt ? 
        Math.round((batch.endedAt.getTime() - batch.startedAt.getTime()) / 60000) : 0
    }));
    
    return NextResponse.json(report);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}