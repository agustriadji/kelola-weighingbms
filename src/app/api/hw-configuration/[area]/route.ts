import { NextRequest, NextResponse } from 'next/server';
import { HwConfigurationService } from '@/services/hw-configuration';
import { HwAreaEnum } from '@/entities/HwConfiguration.entity';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { area: string } }
) {
  try {
    const area = params.area as HwAreaEnum;
    
    if (!Object.values(HwAreaEnum).includes(area)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid area' 
      }, { status: 400 });
    }

    const service = HwConfigurationService.getInstance();
    const result = await service.getByArea(area);
    
    if (result.success) {
      return NextResponse.json(result);
    }
    
    return NextResponse.json(result, { status: 404 });
  } catch (error) {
    console.error('Error fetching hw configuration:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch configuration' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { area: string } }
) {
  try {
    const area = params.area as HwAreaEnum;
    
    if (!Object.values(HwAreaEnum).includes(area)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid area' 
      }, { status: 400 });
    }

    const service = HwConfigurationService.getInstance();
    const result = await service.remove(area);
    
    if (result.success) {
      return NextResponse.json(result);
    }
    
    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error('Error removing hw configuration:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to remove configuration' 
    }, { status: 500 });
  }
}