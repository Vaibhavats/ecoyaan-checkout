import cartData from "../data/cartData.json"
import Link from "next/link"

interface CartData {
  cartItems: Array<{
    product_id: string
    product_name: string
    product_price: number
    quantity: number
    image: string
  }>
  shipping_fee: number
  discount_applied: number
}

export default function Home() {

  const subtotal = (cartData as CartData).cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  )

  const total =
    subtotal +
    (cartData as CartData).shipping_fee -
    (cartData as CartData).discount_applied

  return (
    <div className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Cart Summary
      </h1>

      {(cartData as CartData).cartItems.map(item => (
        <div
          key={item.product_id}
          className="flex gap-4 border rounded p-4 mb-4"
        >
          <img src={item.image} width="80"/>

          <div>
            <h2 className="font-semibold">
              {item.product_name}
            </h2>

            <p>Price: ₹{item.product_price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        </div>
      ))}

      <div className="border-t pt-4 mt-6">

        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping: ₹{(cartData as CartData).shipping_fee}</p>

        <p className="font-bold text-lg">
          Total: ₹{total}
        </p>

      </div>

      <Link
        href="/checkout"
        className="inline-block mt-6 bg-green-600 text-white px-5 py-3 rounded"
      >
        Proceed to Checkout
      </Link>

    </div>
  )
}