import { NextRequest, NextResponse } from 'next/server';
import { HwGeneralApiService } from '@/services/hw-general-api.service';
import { UpsertHwGeneralApiSchema } from '@/schemas/hw-general-api';
import { getRequestContext } from '@/utils/context';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const service = HwGeneralApiService.getInstance();
    const result = await service.get();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching hw general api:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch general API configuration',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getRequestContext(request);
    if (!context.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorizeds',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = UpsertHwGeneralApiSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid data',
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const service = HwGeneralApiService.getInstance();
    const result = await service.upsert(validation.data, context.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error upserting hw general api:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save general API configuration',
      },
      { status: 500 }
    );
  }
}
