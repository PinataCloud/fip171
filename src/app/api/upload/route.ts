import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { verifySession } from '@/app/utils'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authToken = request?.headers?.get('authorization')?.replace('Bearer ', '') || ""

    const verified = await verifySession(authToken);
    if (!verified) {
      return new Response("Unauthorized", { status: 401 })
    }
    const jwt = process.env.PINATA_JWT

    const payload = await request.json()

    const body = {
      "pinataOptions":{"cidVersion":1},
      "pinataContent": payload
    }
    const res = await fetch(
      `https://api.pinata.cloud/pinning/pinJSONToIPFS`,
      {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${jwt}`, 
          'Content-Type': "application/json"
        }, 
        body: JSON.stringify(body)
      }
    );
    const data = await res.json();
    return Response.json(data) 
  } catch (error) {
    console.log("Error in fetch")
    return new Response("Server error", { status: 500 })
  }  
}
