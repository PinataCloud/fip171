import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const jwt =process.env.PINATA_JWT
    const res = await fetch(
      `https://api.pinata.cloud/v3/farcaster/casts?channel=books`,
      {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      }
    );
    const data = await res.json();
    return Response.json(data) 
  } catch (error) {
    console.log("Error in fetch")
    return new Response("Server error", { status: 500 })
  }  
}
