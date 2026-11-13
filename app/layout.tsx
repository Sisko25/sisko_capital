import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProcurementModal from "@/components/procurement-modal"

const inter = Inter({ subsets: ["latin"] })

export const dynamic = "force-dynamic"
export const revalidate = 0

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
}

export const metadata: Metadata = {
  title: "Sisko Aerospace LLP | AI Detection Systems",
  description: "Sisko Aerospace LLP develops AVIARS — Autonomous Video & Signal Aerial Recognition Software — for next-generation aerial intelligence and defense.",
}

const chunkRecoveryScript = `
(function() {
  function recoverFromChunkError() {
    try {
      var key = '__sisko_chunk_reload_ts';
      var last = Number(sessionStorage.getItem(key) || '0');
      var now = Date.now();
      if (now - last > 10000) {
        sessionStorage.setItem(key, String(now));
        window.location.reload();
      }
    } catch (e) {}
  }
  window.addEventListener('error', function(e) {
    var t = e && e.target;
    if (t && t.tagName === 'SCRIPT' && t.src && t.src.indexOf('/_next/static/chunks/') !== -1) {
      recoverFromChunkError();
      return;
    }
    var msg = (e && e.message) || '';
    if (msg.indexOf('ChunkLoadError') !== -1 || msg.indexOf('Loading chunk') !== -1 || msg.indexOf('Minified React error #423') !== -1) {
      recoverFromChunkError();
    }
  }, true);
  window.addEventListener('unhandledrejection', function(e) {
    var r = e && e.reason;
    var msg = (r && (r.message || r.name || String(r))) || '';
    if (msg.indexOf('ChunkLoadError') !== -1 || msg.indexOf('Loading chunk') !== -1) {
      recoverFromChunkError();
    }
  });
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: chunkRecoveryScript }} />
      </head>
      <body className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen antialiased`}>
        <Header />
        <main className="pt-16 sm:pt-20 lg:pt-24">{children}</main>
        <Footer />
        <ProcurementModal />
      </body>
    </html>
  )
}
