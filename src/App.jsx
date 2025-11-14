import { useEffect, useMemo, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function AttractionCard({ item }) {
  const img = item.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'
  return (
    <div className="group bg-white/80 backdrop-blur rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-3">
        <img src={img} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition" />
        {item.category && (
          <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-white/90 text-gray-700 shadow">
            {item.category}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 items-center text-sm text-gray-500">
        {item.location && (
          <span className="px-2 py-1 bg-gray-100 rounded">{item.location}</span>
        )}
        {typeof item.rating === 'number' && (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">★ {item.rating.toFixed(1)}</span>
        )}
      </div>
    </div>
  )
}

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')

  const categories = ['Beach', 'Fort', 'Temple', 'Waterfall', 'Activity']
  const locations = ['Malvan', 'Tarkarli', 'Vengurla', 'Sawantwadi', 'Kankavli']

  const hasData = items && items.length > 0

  const fetchAttractions = async () => {
    setLoading(true)
    setError('')
    try {
      const body = { q: q || null, category: category || null, location: location || null, limit: 100 }
      const res = await fetch(`${BACKEND}/api/attractions/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttractions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const seedData = useMemo(() => ([
    {
      name: 'Tarkarli Beach',
      description: 'Pristine white sands, clear waters and scuba/snorkeling.',
      category: 'Beach',
      location: 'Tarkarli',
      image_url: 'https://images.unsplash.com/photo-1501959915551-4e8d30928317?q=80&w=1200&auto=format&fit=crop',
      rating: 4.7,
      tags: ['water sports', 'snorkeling', 'scuba']
    },
    {
      name: 'Sindhudurg Fort',
      description: 'Historic sea fort built by Chhatrapati Shivaji Maharaj on an island off Malvan.',
      category: 'Fort',
      location: 'Malvan',
      image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
      rating: 4.6,
      tags: ['history', 'sea fort']
    },
    {
      name: 'Rock Garden',
      description: 'Sunset point with rugged rocks and crashing waves by the shore.',
      category: 'Activity',
      location: 'Malvan',
      image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
      rating: 4.3,
      tags: ['sunset', 'viewpoint']
    },
    {
      name: 'Redi Ganesh Temple',
      description: 'Ancient cave temple of Lord Ganesh near Vengurla-Redi border.',
      category: 'Temple',
      location: 'Vengurla',
      image_url: 'https://images.unsplash.com/photo-1568342821492-45827d6e1fd5?q=80&w=1200&auto=format&fit=crop',
      rating: 4.5,
      tags: ['pilgrimage', 'heritage']
    }
  ]), [])

  const seedAttractions = async () => {
    setLoading(true)
    setError('')
    try {
      for (const s of seedData) {
        await fetch(`${BACKEND}/api/attractions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(s)
        })
      }
      await fetchAttractions()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-amber-50">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">S</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Sindhudurg Tourism</h1>
              <p className="text-xs text-gray-500">Beaches • Forts • Temples • Adventures</p>
            </div>
          </div>
          <a href="/test" className="text-sm text-blue-600 hover:text-blue-700">System check</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search attractions, e.g., beach, fort, scuba"
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="px-3 py-2 rounded-lg border">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={location} onChange={(e)=>setLocation(e.target.value)} className="px-3 py-2 rounded-lg border">
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <button onClick={fetchAttractions} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Search</button>
          </div>
          {!hasData && (
            <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
              <span>No attractions yet. You can seed a few sample places to get started.</span>
              <button onClick={seedAttractions} className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">Add sample data</button>
            </div>
          )}
        </section>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>
        )}

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-white/60 rounded-xl animate-pulse" />
            ))
          ) : (
            items.map(item => (
              <AttractionCard key={item.id || item.name} item={item} />
            ))
          )}
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500">
        Made with ❤️ for Sindhudurg. Explore responsibly.
      </footer>
    </div>
  )
}

export default App
