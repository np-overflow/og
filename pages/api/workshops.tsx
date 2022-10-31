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

const interBold = fetch(new URL('../../assets/Inter-Bold.otf', import.meta.url)).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const interBoldData = await interBold

  if (!searchParams.has("name")) {
    return new ImageResponse(
      <div tw="flex flex-col justify-between h-full w-full bg-white" style={{ fontFamily: 'Inter' }}>
        <div tw="flex p-15">
          <h1 tw="text-6xl font-bold">Overflow Workshops</h1>
        </div>

        <div tw="flex ml-auto">
          <OverflowLogoFullBlack width={200} height={200} />
        </div>
      </div>,
      {
        width: 1200,
        height: 630, fonts: [
          {
            name: 'Inter',
            data: interBoldData,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    )
  }
}
