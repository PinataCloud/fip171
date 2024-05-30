'use client'
import React from 'react'
import { CastProps } from './LongCastExpand'
import Loader from './Loader'

const StandardCast = ({ data, loading }: CastProps) => {
  const Embeds = ({ cast }: { cast: any }) => {
    if (cast.embeds && cast.embeds.length > 0) {
      return cast.embeds.map((e: any) => {
        return (
          <div className="w-full" key={e.url}>
            {
              e.url.includes(".png") || e.url.includes(".jpg") || e.url.includes(".jpeg") || e.url.includes(".gif") || e.url.includes(".svg") ?
                <img src={e.url} /> :
                <a target="_blank" rel="noreferrer noopener" className="underline truncate block" href={e.url}>{e.url}</a>
            }
          </div>)
      })
    }
    return ""
  }
  return (
    <div>
      {
        loading ? 
        <Loader /> :
        data.casts && data.casts.length &&
        data.casts.map((c: any) => {
          return (
            <div className="w-full border border-gray-700 p-4" key={c.hash}>
              <div className="flex items-center">
                <img src={c.author.pfp_url} alt={c.author.display_name} className="h-12 w-12 rounded-full" />
                <div className="ml-2">
                  <h3 className="text-xl">{c.author.display_name}</h3>
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

export default StandardCast