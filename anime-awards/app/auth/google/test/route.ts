import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse(
    '✅ Callback route is working!',
    { status: 200 }
  )
}
