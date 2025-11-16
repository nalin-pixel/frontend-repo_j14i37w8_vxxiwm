import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const BRAND = {
  name: 'SportEase',
  colors: { primary: '#00C853', secondary: '#212121', accent: '#2196F3' },
  fonts: { heading: 'Poppins', body: 'Inter' }
}

const API = import.meta.env.VITE_BACKEND_URL || ''

function useFetch(url, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(url)
      .then(r => r.json())
      .then(d => mounted && setData(d))
      .catch(e => mounted && setError(e))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, deps)
  return { data, loading, error }
}

function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-neutral-900/60 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[--brand] shadow-inner" />
          <span className="font-semibold" style={{fontFamily: BRAND.fonts.heading}}>SportEase</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a className="hover:opacity-80" href="#venues">Venues</a>
          <a className="hover:opacity-80" href="#pricing">Pricing</a>
          <a className="hover:opacity-80" href="#faq">FAQ</a>
          <button className="px-3 py-2 rounded-xl text-white shadow-lg"
            style={{background: BRAND.colors.primary}}>List your venue</button>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[70vh] grid place-items-center">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
        <div className="backdrop-blur bg-white/70 dark:bg-neutral-900/60 p-6 rounded-2xl shadow-xl">
          <h1 className="text-3xl md:text-5xl font-semibold mb-3" style={{fontFamily: BRAND.fonts.heading}}>Book sports venues instantly</h1>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6" style={{fontFamily: BRAND.fonts.body}}>Search, compare and book turfs and courts across Vadodara.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="col-span-1 md:col-span-1 px-4 py-3 rounded-xl border" placeholder="City"/>
            <input className="col-span-1 md:col-span-1 px-4 py-3 rounded-xl border" placeholder="Sport"/>
            <input type="date" className="col-span-1 md:col-span-1 px-4 py-3 rounded-xl border" />
            <button className="col-span-1 px-4 py-3 rounded-xl text-white shadow-lg" style={{background: BRAND.colors.primary}}>Search</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedVenues() {
  const { data } = useFetch(`${API}/api/venues?seeded_only=true&limit=8`, [API])
  const items = data?.items || []
  return (
    <section id="venues" className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-semibold" style={{fontFamily: BRAND.fonts.heading}}>Featured venues</h2>
        <a className="text-sm" style={{color: BRAND.colors.accent}} href="#">See all</a>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map(v => (
          <article key={v.id} className="rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow hover:shadow-xl transition">
            <div className="h-32 bg-gradient-to-br from-emerald-200 to-emerald-400" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                {v.isSeeded && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Founding Partner</span>}
              </div>
              <h3 className="font-medium mb-1">{v.name}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">{v.address}</p>
              <div className="flex items-center justify-between text-sm">
                <span>₹{v.pricePerHour}/hr</span>
                <button className="px-3 py-2 rounded-lg text-white" style={{background: BRAND.colors.primary}}>View</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Footer(){
  return (
    <footer className="mt-20 border-t">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-neutral-600">
        © {new Date().getFullYear()} SportEase. Built for demo.
      </div>
    </footer>
  )
}

export default function App(){
  useEffect(() => {
    document.documentElement.style.setProperty('--brand', BRAND.colors.primary)
  }, [])
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
      <Header/>
      <Hero/>
      <FeaturedVenues/>
      <Footer/>
    </div>
  )
}
