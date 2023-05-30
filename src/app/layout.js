import './globals.css'

export const metadata = {
  title: 'SPK',
  description: 'Generated by create next app',
  viewport: 'width=device-width, initial-scale=1.0',
  charset: 'utf-8',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' />
      </head>
      <body className={`h-screen`}>{children}</body>
    </html>
  )
}
