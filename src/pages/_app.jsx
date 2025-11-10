import "@/styles/globals.scss";
import localFont from 'next/font/local'

const helvetica = localFont({
  src: [
    {
      path: '../fonts/helvetica-light-587ebe5a59211.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/Helvetica.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Helvetica-Oblique.woff',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/Helvetica-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Helvetica-BoldOblique.woff',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-helvetica',
})

export default function App({ Component, pageProps }) {
  return (
    <div className={helvetica.className}>
      <Component {...pageProps} />
    </div>
  );
}
