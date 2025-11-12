import { ShoppingCart, Store, Menu } from 'lucide-react'

export default function Navbar({ cartCount, onCartClick }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
            <Store size={18} />
          </div>
          <span className="text-xl font-bold text-gray-800">SwiftShip</span>
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={onCartClick}
            className="relative inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white w-5 h-5 rounded-full grid place-items-center">
                {cartCount}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 rounded hover:bg-gray-100">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
