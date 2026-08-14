import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const body = await req.json()

  try {
    const lead = await payload.create({ collection: 'leads', data: body })
    return NextResponse.json({ ok: true, id: lead.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
