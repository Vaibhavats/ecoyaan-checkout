"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";






function generateOrderId() {
  return "ECO" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function SuccessPage() {
  const { addresses, selectedAddressId, cartItems } = useCheckout();
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shipping;
  const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
  const [orderId] = useState(generateOrderId);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

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

      <div className="page-content" style={{ paddingBottom: "40px" }}>
        {/* Success hero */}
        <div style={{
          background: "linear-gradient(160deg, var(--green-800) 0%, var(--green-700) 100%)",
          padding: "40px 24px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          {/* Checkmark */}
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            transition: "transform 0.5s ease",
            transform: visible ? "scale(1)" : "scale(0.5)",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12l5 5L20 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="24"
                strokeDashoffset={visible ? "0" : "24"}
                style={{ transition: "stroke-dashoffset 0.6s ease 0.3s" }}
              />
            </svg>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 700, color: "white", marginBottom: "8px" }}>
            Order Confirmed!
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", marginBottom: "16px" }}>
            Thank you for choosing a sustainable lifestyle 🌿
          </p>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", borderRadius: "20px", padding: "6px 16px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "white", letterSpacing: "0.1em" }}>#{orderId}</span>
          </div>
        </div>

        <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Delivery info */}
          {selectedAddr && (
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="3" width="20" height="18" rx="3" stroke="var(--green-600)" strokeWidth="2"/>
                  <path d="M8 10h8M8 14h5" stroke="var(--green-600)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--green-700)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Delivery Details</span>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{selectedAddr.fullName}</div>
              <div style={{ fontSize: "13px", color: "var(--gray-600)", lineHeight: 1.6 }}>
                {selectedAddr.addressLine1}{selectedAddr.addressLine2 && `, ${selectedAddr.addressLine2}`}<br/>
                {selectedAddr.city}, {selectedAddr.state} – {selectedAddr.pincode}
              </div>
              <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="var(--amber)" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "12px", color: "var(--amber)", fontWeight: 600 }}>Expected in 3–5 business days</span>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--gray-600)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
              Items Ordered
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--gray-400)" }}>Qty: {item.quantity}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--green-800)" }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
            <hr className="divider" style={{ margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600 }}>Total Paid</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--green-800)" }}>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Eco impact */}
          <div style={{ background: "var(--green-50)", border: "1px solid var(--green-100)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px" }}>🌱</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, color: "var(--green-800)" }}>Your Eco Impact</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--green-700)", lineHeight: 1.6, margin: 0 }}>
              By choosing Ecoyaan, you've helped reduce plastic waste and support sustainable farming practices. Every purchase plants a tree! 🌳
            </p>
          </div>

          {/* CTA */}
          <Link href="/" className="btn btn-primary" style={{ marginTop: "8px", textAlign: "center", justifyContent: "center" }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
