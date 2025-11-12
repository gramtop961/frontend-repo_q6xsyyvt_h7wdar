import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/products`)
        const data = await res.json()
        setProducts(data.items || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const addToCart = async (p) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.title === p.title)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 }
        return copy
      }
      return [...prev, { ...p, quantity: 1 }]
    })
  }

  const checkout = async () => {
    if (cart.length === 0) return
    const payload = {
      customer_name: 'Guest',
      customer_email: 'guest@example.com',
      customer_address: 'TBD',
      items: cart.map((c) => ({
        product_id: c._id || '',
        title: c.title,
        price: c.price,
        quantity: c.quantity,
      })),
      subtotal: cart.reduce((s, it) => s + it.price * it.quantity, 0),
      shipping: cart.reduce((s, it) => s + it.price * it.quantity, 0) > 100 ? 0 : 7.5,
      total: 0,
      status: 'pending',
    }
    payload.total = payload.subtotal + payload.shipping

    try {
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      alert(`Order placed! ID: ${data.id}`)
      setCart([])
      setCartOpen(false)
    } catch (e) {
      alert('Checkout failed')
    }
  }

  const subscribe = async (email) => {
    try {
      await fetch(`${baseUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'website' }),
      })
      alert('Subscribed!')
    } catch (e) {
      alert('Subscription failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.reduce((s, it) => s + it.quantity, 0)} onCartClick={() => setCartOpen(true)} />

      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Launch your dropshipping store fast</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">Add curated products, accept orders, and ship from suppliers without holding inventory.</p>

          <div className="mt-6 flex gap-3">
            <a href="#catalog" className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Browse Catalog</a>
            <a href="/test" className="px-5 py-3 bg-gray-900 hover:bg-black text-white rounded-md">Status</a>
          </div>
        </div>
      </section>

      <section id="catalog" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending products</h2>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const email = e.currentTarget.email.value
              subscribe(email)
              e.currentTarget.reset()
            }}
          >
            <input name="email" required placeholder="Get promos by email" className="px-3 py-2 rounded-md border w-64" />
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Subscribe</button>
          </form>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading products…</p>
        ) : products.length === 0 ? (
          <div className="text-gray-600 bg-white border rounded-lg p-6">
            <p>No products yet. Add some via the API to see them here.</p>
            <p className="mt-2 text-sm">Tip: POST to /api/products with a product JSON.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onAdd={addToCart} />
            ))}
          </div>
        )}
      </section>

      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onCheckout={checkout} />

      <footer className="border-t py-10 text-center text-sm text-gray-500">© {new Date().getFullYear()} SwiftShip. All rights reserved.</footer>
    </div>
  )
}

export default App
