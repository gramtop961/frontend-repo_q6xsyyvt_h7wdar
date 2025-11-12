import { useEffect, useState } from 'react'
import { ShoppingCart, Search, Package, Check, Truck, Star } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero({ onBrowse }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-blue-700 ring-1 ring-blue-200">
              <Star className="w-3.5 h-3.5" /> Start your dropshipping brand today
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Launch a beautiful store in minutes
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Import trending products, showcase them with a clean storefront, and start taking orders fast.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={onBrowse} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow">
                Browse Products
              </button>
              <a href="#how" className="px-5 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow ring-1 ring-gray-200">
                How it works
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600"/> No inventory</div>
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-blue-600"/> Auto-fulfillment</div>
              <div className="flex items-center gap-2"><Package className="w-4 h-4 text-purple-600"/> Branded packaging</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-200/40 to-purple-200/40 blur-2xl rounded-3xl"/>
            <div className="relative bg-white rounded-3xl shadow-xl ring-1 ring-gray-100 p-6">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <ShoppingCart className="w-24 h-24 text-white/90" />
              </div>
              <div className="mt-4">
                <div className="h-3 w-2/3 bg-gray-100 rounded"/>
                <div className="mt-2 h-3 w-1/2 bg-gray-100 rounded"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ p, add }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 hover:shadow-lg transition p-4">
      <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Package className="w-12 h-12 text-gray-400 group-hover:text-gray-500" />
      </div>
      <h3 className="mt-3 font-semibold text-gray-900 line-clamp-1">{p.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{p.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold">${Number(p.price).toFixed(2)}</span>
        <button onClick={() => add(p)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">Add</button>
      </div>
    </div>
  )
}

function Catalog({ add }) {
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/products`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const shown = items.filter(p => p.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Catalog</h2>
        <div className="flex items-center gap-2 bg-white rounded-xl ring-1 ring-gray-200 px-3 py-2 w-full max-w-sm">
          <Search className="w-4 h-4 text-gray-500" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products" className="w-full outline-none text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[...Array(8)].map((_,i) => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {shown.map(p => <ProductCard key={p.id} p={p} add={add} />)}
        </div>
      )}
    </section>
  )
}

function Cart({ items, remove, checkout }) {
  const total = items.reduce((s, i) => s + i.price, 0)
  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 w-80 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Your Cart</div>
        <div className="text-sm text-gray-500">{items.length} items</div>
      </div>
      <div className="mt-2 space-y-2 max-h-60 overflow-auto">
        {items.map((i,idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="truncate mr-2">{i.title}</span>
            <span className="font-medium">${Number(i.price).toFixed(2)}</span>
            <button onClick={() => remove(idx)} className="ml-2 text-red-500">×</button>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-gray-500">Cart is empty</div>}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold">${total.toFixed(2)}</span>
        <button onClick={checkout} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">Checkout</button>
      </div>
    </div>
  )
}

export default function App() {
  const [cart, setCart] = useState([])
  const add = (p) => setCart(c => [...c, p])
  const remove = (i) => setCart(c => c.filter((_,idx) => idx !== i))

  const seed = async () => {
    try { await fetch(`${API_BASE}/seed`, { method: 'POST' }) } catch {}
  }

  useEffect(() => { seed() }, [])

  const checkout = async () => {
    if (cart.length === 0) return alert('Add items first')
    const payload = {
      customer_name: 'Guest',
      customer_email: 'guest@example.com',
      shipping_address: '123 Demo St',
      items: cart.map(p => ({ product_id: p.id, quantity: 1 })),
    }
    const res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    if (res.ok) {
      alert('Order placed! Total $' + data.total.toFixed(2))
      setCart([])
    } else {
      alert(data.detail || 'Failed to place order')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl">DropShip<span className="text-blue-600">Now</span></div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#catalog" className="hover:text-gray-900">Catalog</a>
            <a href="#how" className="hover:text-gray-900">How it works</a>
            <a href="#faq" className="hover:text-gray-900">FAQ</a>
          </nav>
        </div>
      </header>

      <Hero onBrowse={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })} />

      <div id="catalog">
        <Catalog add={add} />
      </div>

      <section id="how" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-2xl ring-1 ring-gray-100">
            <Search className="w-5 h-5"/>
            <h3 className="mt-2 font-semibold">Find products</h3>
            <p className="text-sm text-gray-600">Pick from our catalog of trending products with reliable suppliers.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl ring-1 ring-gray-100">
            <ShoppingCart className="w-5 h-5"/>
            <h3 className="mt-2 font-semibold">Add to your store</h3>
            <p className="text-sm text-gray-600">Create a branded storefront and start taking orders instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl ring-1 ring-gray-100">
            <Truck className="w-5 h-5"/>
            <h3 className="mt-2 font-semibold">We ship for you</h3>
            <p className="text-sm text-gray-600">Suppliers fulfill orders directly to your customers worldwide.</p>
          </div>
        </div>
      </section>

      {cart.length > 0 && <Cart items={cart} remove={remove} checkout={checkout} />}

      <footer className="mt-20 border-t">
        <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-gray-500">
          © {new Date().getFullYear()} DropShipNow. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
