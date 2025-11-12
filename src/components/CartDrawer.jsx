import { useMemo } from 'react'

export default function CartDrawer({ open, items, onClose, onCheckout }) {
  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0)
    const shipping = subtotal > 100 ? 0 : 7.5
    const total = subtotal + shipping
    return { subtotal, shipping, total }
  }, [items])

  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-medium">{it.title}</p>
                  <p className="text-sm text-gray-500">Qty {it.quantity}</p>
                </div>
                <div className="font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>${totals.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  )
}
