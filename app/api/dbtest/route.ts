import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[dbtest] connectivity failed', error)
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : 'Unknown database error',
      },
      { status: 500 }
    )
  }
}

