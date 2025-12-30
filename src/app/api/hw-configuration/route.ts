import { NextRequest, NextResponse } from 'next/server';
import { HwConfigurationService } from '@/services/hw-configuration';
import { UpsertHwConfigurationSchema } from '@/schemas/hw-configuration';
import { getRequestContext } from '@/utils/context';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const service = HwConfigurationService.getInstance();
    const result = await service.getAll();
    
    if (result.success) {
      return NextResponse.json(result);
    }
    
    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error('Error fetching hw configurations:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch configurations' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getRequestContext(request);
    if (!context.user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = UpsertHwConfigurationSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid data',
        errors: validation.error.errors 
      }, { status: 400 });
    }

    const service = HwConfigurationService.getInstance();
    const result = await service.upsert(validation.data, context.user.id);
    
    if (result.success) {
      return NextResponse.json(result);
    }
    
    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error('Error upserting hw configuration:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to save configuration' 
    }, { status: 500 });
  }
}