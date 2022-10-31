import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

import OverflowLogoFullBlack from "../../components/OverflowLogoFullBlack"

export const config = {
  runtime: 'experimental-edge'
}

interface NuxtContentQueryResponse {
  workshops: {
    name: string
    start_date: string
    end_date: string
    meeting_url: string
  }[]
}

const query = new URLSearchParams({
  _params: JSON.stringify({ "first": true, "where": [{ "_path": "/workshops" }] })
})

async function isValidWorkshop(name: string) {
  const data = await (await fetch(`https://next.np-overflow.club/api/_content/query?${query.toString()}`, {
    next: {
      revalidate: 3600
    }
  })).json() as NuxtContentQueryResponse

  return data.workshops.some((workshop) => workshop.name === name)
}

const cubano = fetch(new URL('../../assets/Cubano.ttf', import.meta.url)).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const cubanoData = await cubano

  if (!searchParams.has("name")) {
    return new ImageResponse(
      <div tw="flex flex-col justify-between h-full w-full" style={{ fontFamily: 'Cubano' }}>
        <div tw="flex flex-col p-15 text-8xl font-bold">
          <span style={{ whiteSpace: 'pre' }}>
            INSPIRING{" "}
            <span tw="text-orange-600">TECH</span>
          </span>
          <span tw="mt-3">
            TALENT EVERYDAY
          </span>
        </div>

        <div tw="flex ml-auto">
          <OverflowLogoFullBlack width={200} height={200} />
        </div>
      </div >,
      {
        width: 1200,
        height: 630, fonts: [
          {
            name: 'Cubano',
            data: cubanoData,
            style: 'normal',
          },
        ],
      }
    )
  }
}