'use client'
import React from 'react'
import { CastProps, Schema } from './LongCastExpand'
import IPFSGatewayTools from "@pinata/ipfs-gateway-tools/dist/node";

const gatewayTools = new IPFSGatewayTools();

const LongcastLink = ({ data }: CastProps) => {
  const parseUri = (uri: string) => {
    const { cid } = gatewayTools.containsCID(uri)
    if (cid) {
      return `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`
    } else {
      return uri
    }
  }
  const Embeds = ({ cast }: { cast: any }) => {
    if (cast.embeds && cast.embeds.length > 0) {
      return cast.embeds.map((e: any) => {
        return (
          <div className="w-full" key={e.url}>
            {
              e.url && e.url.includes("fc+") ?
                <a className="underline truncate block" href={parseUri(e.url)}>{e.url.split("fc+")[1]}</a> :
                e.url.includes(".png") || e.url.includes(".jpg") || e.url.includes(".jpeg") || e.url.includes(".gif") || e.url.includes(".svg") ?
                  <img src={e.url} /> :
                  <a className="underline truncate block" href={e.url}>{e.url}</a>
            }
          </div>)
      })
    }
    return ""
  }
  return (
    <div>
      {
        data.casts && data.casts.length &&
        data.casts.map((c: any) => {
          return (
            <div className="w-full border border-gray-700 p-4" key={c.hash}>
              <div className="flex items-center">
                <img src={c.author.pfp_url} alt={c.author.display_name} className="h-10 w-10 rounded-full" />
                <div className="ml-2">
                  <h3 className="text-lg">{c.author.display_name}</h3>
                  <p className="text-md text-gray-500">@{c.author.username}</p>
                </div>
              </div>
              <div>
                {c.text}
              </div>
              <div>
                <Embeds cast={c} />
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default LongcastLink