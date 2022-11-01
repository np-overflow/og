import { ImageResponse } from '@vercel/og'
import OverflowLogoFullBlack from '../../components/OverflowLogoFullBlack'

export const config = {
  runtime: 'experimental-edge',
}

const font = fetch(new URL('../../assets/TYPEWR__.TTF', import.meta.url)).then(
  (res) => res.arrayBuffer()
)

export default async function handler() {
  const fontData = await font

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'white',
          height: '100%',
          width: '100%',
          fontSize: 100,
          fontFamily: 'Typewriter',
          paddingTop: '100px',
          paddingLeft: '50px',
          display: 'flex'
        }}
      >
        Hello world!
        <OverflowLogoFullBlack />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Typewriter',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}
