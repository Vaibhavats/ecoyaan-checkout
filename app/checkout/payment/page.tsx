"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Stepper from "@/components/Stepper";
import { useCheckout } from "@/context/CheckoutContext";






const PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI",
    desc: "Pay via PhonePe, GPay, Paytm, or any UPI app",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="var(--green-700)" strokeWidth="1.8"/>
        <path d="M2 10h20" stroke="var(--green-700)" strokeWidth="1.8"/>
        <circle cx="7" cy="15" r="1.5" fill="var(--green-500)"/>
      </svg>
    ),
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    desc: "All major cards accepted",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="var(--amber)" strokeWidth="1.8"/>
        <path d="M2 10h20" stroke="var(--amber)" strokeWidth="1.8"/>
        <path d="M6 15h4" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="var(--green-700)" strokeWidth="1.8"/>
        <path d="M9 12l2 2 4-4" stroke="var(--green-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod, addresses, selectedAddressId, cartItems } = useCheckout();
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shipping;
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [placing, setPlacing] = useState(false);

  const selectedAddr = addresses.find((a) => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (paymentMethod === "upi" && !/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
      setUpiError("Enter a valid UPI ID (e.g. name@upi)");
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1800));
    router.push("/success");
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  return (
    <>
      {/* Header */}
      <header className="eco-header">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div className="eco-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.93L5.71 21l1-1.87c.43.3.9.57 1.41.84C12 22 17 19 17 12h3V8h-3z" fill="#52B788"/>
            </svg>
          </div>
          <div>
            <span className="eco-logo-text">Ecoyaan</span>
            <span className="eco-logo-sub">Live sustainably</span>
          </div>
        </Link>
      </header>

      <Stepper currentStep={3} />

      <div className="page-content">
        <div style={{ padding: "8px 20px 20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h1 className="section-title">Payment</h1>
            <p className="section-subtitle">Choose how you'd like to pay</p>
          </div>

          {/* Delivery to card */}
          {selectedAddr && (
            <div style={{ background: "var(--green-50)", border: "1px solid var(--green-100)", borderRadius: "var(--radius-md)", padding: "12px 14px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="var(--green-600)" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="var(--green-600)" strokeWidth="2"/>
              </svg>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--green-700)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Delivering to</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--gray-900)" }}>{selectedAddr.fullName}</div>
                <div style={{ fontSize: "12px", color: "var(--gray-600)", lineHeight: 1.5 }}>
                  {selectedAddr.addressLine1}, {selectedAddr.city}, {selectedAddr.state} – {selectedAddr.pincode}
                </div>
              </div>
              <Link href="/checkout" style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, color: "var(--green-700)", textDecoration: "none", flexShrink: 0, paddingTop: "2px" }}>Change</Link>
            </div>
          )}

          {/* Payment methods */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {PAYMENT_METHODS.map((m) => {
              const isActive = paymentMethod === m.id;
              return (
                <div key={m.id}>
                  <div
                    className={`card ${isActive ? "selected" : ""}`}
                    style={{ padding: "14px", cursor: "pointer" }}
                    onClick={() => setPaymentMethod(m.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${isActive ? "var(--green-600)" : "var(--gray-300)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isActive ? "var(--green-600)" : "transparent",
                        transition: "all 0.2s",
                      }}>
                        {isActive && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "white" }} />}
                      </div>
                      <div style={{ width: "36px", height: "36px", background: "var(--gray-100)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {m.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 600 }}>{m.label}</div>
                        <div style={{ fontSize: "12px", color: "var(--gray-500)", marginTop: "1px" }}>{m.desc}</div>
                      </div>
                    </div>

                    {/* Expanded forms */}
                    {isActive && m.id === "upi" && (
                      <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--gray-200)" }}>
                        <div className="form-group">
                          <label className="form-label">UPI ID</label>
                          <input
                            className={`form-input${upiError ? " error" : ""}`}
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => { setUpiId(e.target.value); setUpiError(""); }}
                          />
                          {upiError && <span className="form-error">⚠ {upiError}</span>}
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                          {["PhonePe", "GPay", "Paytm", "BHIM"].map((app) => (
                            <button key={app} className="btn btn-ghost" style={{ fontSize: "11px", padding: "6px 12px" }}>{app}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    {isActive && m.id === "card" && (
                      <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--gray-200)", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div className="form-group">
                          <label className="form-label">Card Number</label>
                          <input className="form-input" placeholder="1234 5678 9012 3456" value={cardNum} onChange={(e) => setCardNum(formatCard(e.target.value))} inputMode="numeric"/>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Name on Card</label>
                          <input className="form-input" placeholder="RAJESH KUMAR" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())}/>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Expiry</label>
                            <input className="form-input" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} inputMode="numeric"/>
                          </div>
                          <div className="form-group">
                            <label className="form-label">CVV</label>
                            <input className="form-input" placeholder="•••" type="password" maxLength={4} value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric"/>
                          </div>
                        </div>
                      </div>
                    )}

                    {isActive && m.id === "cod" && (
                      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--gray-200)", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
                          <circle cx="12" cy="12" r="10" stroke="var(--amber)" strokeWidth="2"/>
                          <path d="M12 8v4M12 16h.01" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <p style={{ fontSize: "12px", color: "var(--gray-600)", margin: 0 }}>
                          Please keep exact change ready. COD available for orders up to ₹5,000.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order total summary */}
          <div className="card" style={{ overflow: "hidden", marginBottom: "24px" }}>
            <div style={{ background: "var(--green-800)", padding: "10px 16px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "white" }}>Order Total</span>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--gray-600)" }}>
                <span>Subtotal</span><span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--gray-600)" }}>
                <span>Shipping</span><span style={{ fontWeight: 600 }}>₹{shipping}</span>
              </div>
              <hr className="divider" style={{ margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--green-800)" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--gray-400)" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: "11px", color: "var(--gray-400)" }}>256-bit SSL encrypted · Your data is safe</span>
          </div>
        </div>
      </div>

      {/* Sticky bottom actions */}
      <div className="sticky-actions">
        <Link href="/checkout" className="btn btn-ghost">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back
        </Link>
        <button
          className="btn btn-primary"
          onClick={handlePlaceOrder}
          disabled={placing}
          style={{ position: "relative", overflow: "hidden" }}
        >
          {placing ? (
            <>
              <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              Placing Order...
            </>
          ) : (
            <>
              Place Order · ₹{total.toLocaleString("en-IN")}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </>
          )}
        </button>
      </div>


    </>
  );
}
