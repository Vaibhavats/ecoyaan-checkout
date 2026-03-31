"use client";
import Link from "next/link";
import Image from "next/image";
import { useCheckout } from "@/context/CheckoutContext";

export default function CartPage() {
  const { cartItems, updateQuantity } = useCheckout();

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <>
      {/* Header */}
      <header className="eco-header">
        <div className="eco-logo">
          <div className="eco-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.93L5.71 21l1-1.87c.43.3.9.57 1.41.84C12 22 17 19 17 12h3V8h-3z" fill="#52B788"/>
            </svg>
          </div>
          <div>
            <span className="eco-logo-text">Ecoyaan</span>
            <span className="eco-logo-sub">Live sustainably</span>
          </div>
        </div>
      </header>

      <div className="page-content">
        {/* Free shipping banner */}
        <div style={{ background: "#F0FAF3", borderBottom: "1px solid #D8F3DC", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="#40916C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: "12px", color: "#2D6A4F", fontWeight: 500 }}>
            {subtotal >= 999
              ? "🎉 You've unlocked free shipping!"
              : `Add ₹${(999 - subtotal).toLocaleString("en-IN")} more for free shipping`}
          </span>
        </div>

        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h1 className="section-title">Your Cart</h1>
            <p className="section-subtitle">
              {cartItems.length > 0
                ? `${cartItems.length} item${cartItems.length > 1 ? "s" : ""} — review before checkout`
                : "Your cart is empty"}
            </p>
          </div>

          {/* Cart items */}
          {cartItems.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              {cartItems.map((item) => (
                <div key={item.id} className="card" style={{ padding: "14px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  {/* Image */}
                  <div style={{ position: "relative", width: "76px", height: "76px", flexShrink: 0, borderRadius: "10px", overflow: "hidden", background: "#F3F0E8" }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name + badge */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3, margin: 0 }}>{item.name}</h3>
                      <span className={`badge ${item.tag === "Bestseller" ? "badge-amber" : "badge-green"}`} style={{ flexShrink: 0 }}>{item.tag}</span>
                    </div>

                    {/* Price + quantity controls */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Quantity stepper */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1.5px solid #E8E3D8", borderRadius: "8px", overflow: "hidden" }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{
                            width: "32px", height: "32px", background: "#F3F0E8",
                            border: "none", cursor: "pointer", fontSize: "16px",
                            fontWeight: 700, color: "#4B5563", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#E8E3D8")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#F3F0E8")}
                        >−</button>
                        <span style={{
                          minWidth: "32px", textAlign: "center", fontSize: "14px",
                          fontWeight: 700, color: "#1A1A1A", padding: "0 4px",
                          background: "#FFFFFF",
                        }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            width: "32px", height: "32px", background: "#F3F0E8",
                            border: "none", cursor: "pointer", fontSize: "16px",
                            fontWeight: 700, color: "#2D6A4F", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#E8E3D8")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#F3F0E8")}
                        >+</button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "17px", fontWeight: 700, color: "#1B4332", fontFamily: "var(--font-display)" }}>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        {item.quantity > 1 && (
                          <span style={{ display: "block", fontSize: "11px", color: "#9CA3AF" }}>₹{item.price} each</span>
                        )}
                      </div>
                    </div>

                    {/* Remove link */}
                    <button
                      onClick={() => updateQuantity(item.id, -item.quantity)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: "#9CA3AF", padding: "4px 0 0", display: "block", textAlign: "left" }}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛒</div>
              <p style={{ fontSize: "14px" }}>No items in your cart yet.</p>
            </div>
          )}

          {/* Promo code */}
          <div className="card" style={{ padding: "12px 14px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center", background: "#FAF8F2" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="#B5761A" strokeWidth="2"/>
              <circle cx="7" cy="7" r="1.5" fill="#B5761A"/>
            </svg>
            <input
              placeholder="Enter promo code"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "#374151" }}
            />
            <button className="btn" style={{ background: "#1B4332", color: "white", padding: "6px 14px", fontSize: "12px", borderRadius: "8px" }}>Apply</button>
          </div>

          {/* Order summary */}
          <div className="card" style={{ overflow: "hidden", marginBottom: "24px" }}>
            <div style={{ background: "#1B4332", padding: "12px 16px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, color: "white" }}>Order Summary</span>
            </div>
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#4B5563" }}>
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span style={{ fontWeight: 600, color: "#1A1A1A" }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#4B5563" }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: 600, color: shipping === 0 ? "#2D6A4F" : "#1A1A1A" }}>
                    {shipping === 0 ? "FREE 🎉" : `₹${shipping}`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#2D6A4F" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>🌿 Eco contribution</span>
                  <span style={{ fontWeight: 600 }}>Included</span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid #E8E3D8", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-display)" }}>Total</span>
                  <span style={{ fontSize: "22px", fontWeight: 700, color: "#1B4332", fontFamily: "var(--font-display)" }}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
            {[
              { icon: "🌿", label: "Eco Certified" },
              { icon: "🔒", label: "Secure Pay" },
              { icon: "↩️", label: "Easy Returns" },
            ].map((t) => (
              <div key={t.label} style={{ textAlign: "center", padding: "10px 6px", background: "#F0FAF3", borderRadius: "12px", border: "1px solid #D8F3DC" }}>
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{t.icon}</div>
                <div style={{ fontSize: "10px", fontWeight: 600, color: "#2D6A4F" }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky action */}
      <div className="sticky-actions">
        <Link
          href={cartItems.length > 0 ? "/checkout" : "#"}
          className="btn btn-primary"
          style={{ fontSize: "15px", padding: "14px 20px", opacity: cartItems.length === 0 ? 0.5 : 1, pointerEvents: cartItems.length === 0 ? "none" : "auto" }}
        >
          Proceed to Checkout
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </>
  );
}
