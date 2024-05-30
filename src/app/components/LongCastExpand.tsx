'use client'
import React, { useEffect, useState } from 'react'
import IPFSGatewayTools from "@pinata/ipfs-gateway-tools/dist/node";
import showdown from "showdown"
import Loader from './Loader';

const converter = new showdown.Converter()
const gatewayTools = new IPFSGatewayTools();

export interface Cast {

}

export interface CastResponse {
  casts: any[],
  next: {
    cursor: string;
  }
}

export type CastProps = {
  data: CastResponse
  loading: boolean
}

export interface Schema {
  type: string;
  content: {
    body: string;
  }
  version: string;
}
const LongCastExpand = ({ data, loading }: CastProps) => {
  const [casts, setCasts] = useState<any[]>([])
  const [expandedCast, setExpandedCast] = useState("")
  useEffect(() => {
    const handleParsing = async () => {
      for (const cast of data.casts) {
        const longText = await parseCastData(cast);
        cast["longText"] = converter.makeHtml(longText || "");
      }
      setCasts(data.casts);
    }
    if (data && data.casts) {
      handleParsing()
    }
  }, [data]);
  const parseCastData = async (c: any) => {
    if (c.embeds && c.embeds.length > 0) {
      const urls = c.embeds.filter((c: any) => c.url);
      for (const url of urls) {
        if (url.url.includes("fc+")) {
          const uri = url.url.split("fc+")[1]
          const { cid } = gatewayTools.containsCID(uri)
          if (cid) {
            const payloadRes = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`)
            const payload: Schema = await payloadRes.json()
            //  Check if type is text/plain
            if (payload?.type === "text/plain" && payload?.content?.body) {
              return payload.content.body
            }
          }
        }
      }
    }
  }
  return (
    <div>
      {
        loading ?
          <Loader />
          :
          casts && casts.length &&
          casts.map((c: any) => {
            return (
              <div className="w-full border border-gray-700 p-4" key={c.hash}>
                <div className="flex items-center">
                  <img src={c.author.pfp_url} alt={c.author.display_name} className="h-12 w-12 rounded-full" />
                  <div className="ml-2">
                    <h3 className="text-xl">{c.author.display_name}</h3>
                    <p className="text-md text-gray-500">@{c.author.username}</p>
                  </div>
                </div>
                <div className="prose lg:prose-lg">
                  {c.longText && expandedCast === c.hash ?
                    <div>
                      <button className="underline mt-2" onClick={() => setExpandedCast("")}>See less</button>
                      <div
                        dangerouslySetInnerHTML={{ __html: c.longText }}
                      />
                      <button className="underline" onClick={() => setExpandedCast("")}>See less</button>
                    </div>
                    : c.longText ?
                      <div>
                        <div
                          dangerouslySetInnerHTML={{ __html: c.longText.substring(0, 200) }}
                        />
                        <button className="underline" onClick={() => setExpandedCast(c.hash)}>See more</button>
                      </div>
                      : c.text}
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

export default LongCastExpand