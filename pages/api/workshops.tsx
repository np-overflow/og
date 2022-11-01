import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

import OverflowLogoFullBlack from "../../components/OverflowLogoFullBlack"

export const config = {
  runtime: 'experimental-edge'
}

interface NuxtContentWorkshop {
  name: string
  slug: string
  start_date: string
  end_date: string
  meeting_url: string
}

interface NuxtContentQueryResponse {
  workshops: NuxtContentWorkshop[]
}

const query = new URLSearchParams({
  _params: JSON.stringify({ "first": true, "where": [{ "_path": "/workshops" }] })
})

async function getWorkshopData(slug: string): Promise<NuxtContentWorkshop | undefined> {
  const data = await (await fetch(`https://next.np-overflow.club/api/_content/query?${query.toString()}`, {
    next: {
      revalidate: 3600
    }
  })).json() as NuxtContentQueryResponse

  return data.workshops.find((workshop) => workshop.slug === slug)
}

const interBold = fetch(new URL('../../assets/Inter-Bold.otf', import.meta.url)).then((res) => res.arrayBuffer())
const interRegular = fetch(new URL('../../assets/Inter-Regular.otf', import.meta.url)).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const [interBoldData, interRegularData] = await Promise.all([interBold, interRegular])

  const slug = searchParams.get('slug')

  const workshopData = slug ? await getWorkshopData(slug) : undefined
  if (!workshopData) {
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

  const startDate = new Date(workshopData.start_date)

  return new ImageResponse(
    <div tw="flex flex-col justify-between h-full w-full bg-white" style={{ fontFamily: 'Inter' }}>
      <div tw="flex justify-between w-full items-center p-15">
        <h1 tw="text-6xl font-bold">{workshopData.name}</h1>
        <div tw="flex bg-orange-100 border border-orange-300 rounded-full px-3 py-2">
          <span tw="text-2xl text-orange-900">{startDate.toLocaleDateString()}</span>
        </div>
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
        {
          name: 'Inter',
          data: interRegularData,
          weight: 500,
          style: 'normal',
        }
      ],
    }
  )
}
