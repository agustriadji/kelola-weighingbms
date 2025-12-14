import { NextRequest, NextResponse } from 'next/server';
import { getVehicleTarraHistoryByContract } from '@/services/inbound/batch.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractNumber = searchParams.get('contractNumber');

    if (!contractNumber) {
      return NextResponse.json(
        { success: false, message: 'Contract number is required' },
        { status: 400 }
      );
    }

    const data = await getVehicleTarraHistoryByContract(contractNumber);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching vehicle tarra history:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}