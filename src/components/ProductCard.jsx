import { useState } from 'react'

export default function ProductCard({ product, onAdd }) {
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    setAdding(true)
    try {
      await onAdd(product)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {product.image ? (
        <img src={product.image} alt={product.title} className="h-48 w-full object-cover" />
      ) : (
        <div className="h-48 w-full bg-gray-100 grid place-items-center text-gray-400 text-sm">
          No image
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description || '—'}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold">${product.price?.toFixed?.(2) ?? product.price}</span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="px-3 py-1.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
