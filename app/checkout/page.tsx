"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Stepper from "@/components/Stepper";
import { useCheckout, Address } from "@/context/CheckoutContext";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh","Other"
];

const EMPTY_FORM = {
  fullName: "", phone: "", addressLine1: "", addressLine2: "",
  city: "", state: "", pincode: "", type: "Home" as Address["type"],
};

export default function CheckoutPage() {
  const router = useRouter();
  const { addresses, selectedAddressId, addAddress, removeAddress, selectAddress } = useCheckout();

  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter valid 10-digit mobile";
    if (!form.addressLine1.trim()) e.addressLine1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingId) {
      const { updateAddress } = require("@/context/CheckoutContext");
      // We use addAddress then remove old for simplicity
      addAddress(form);
      removeAddress(editingId);
    } else {
      addAddress(form);
    }
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (addr: Address) => {
    setForm({
      fullName: addr.fullName, phone: addr.phone,
      addressLine1: addr.addressLine1, addressLine2: addr.addressLine2,
      city: addr.city, state: addr.state, pincode: addr.pincode, type: addr.type,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleNext = () => {
    if (selectedAddressId) router.push("/checkout/payment");
  };

  const field = (key: keyof typeof EMPTY_FORM) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
    className: `form-input${errors[key] ? " error" : ""}`,
  });

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

      <Stepper currentStep={2} />

      <div className="page-content">
        <div style={{ padding: "8px 20px 20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h1 className="section-title">Delivery Address</h1>
            <p className="section-subtitle">
              {addresses.length === 0 ? "Add your delivery address" : `${addresses.length} saved address${addresses.length > 1 ? "es" : ""}`}
            </p>
          </div>

          {/* Saved addresses */}
          {addresses.length > 0 && !showForm && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <div
                    key={addr.id}
                    className={`card ${isSelected ? "selected" : ""}`}
                    style={{ padding: "14px", cursor: "pointer" }}
                    onClick={() => selectAddress(addr.id)}
                  >
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      {/* Radio */}
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
                        border: `2px solid ${isSelected ? "var(--green-600)" : "var(--gray-300)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isSelected ? "var(--green-600)" : "transparent",
                        transition: "all 0.2s",
                      }}>
                        {isSelected && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "white" }} />}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: "14px" }}>{addr.fullName}</span>
                          <span className="badge badge-green" style={{ fontSize: "9px" }}>{addr.type}</span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--gray-600)", lineHeight: 1.5, margin: 0 }}>
                          {addr.addressLine1}
                          {addr.addressLine2 && `, ${addr.addressLine2}`}<br />
                          {addr.city}, {addr.state} – {addr.pincode}
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--gray-400)", margin: "4px 0 0" }}>📞 {addr.phone}</p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: "5px 10px", fontSize: "11px", fontWeight: 600 }}
                          onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
                        >Edit</button>
                        <button
                          className="btn btn-danger-ghost"
                          style={{ padding: "5px 10px", fontSize: "11px" }}
                          onClick={(e) => { e.stopPropagation(); removeAddress(addr.id); }}
                        >Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add new button */}
              <button className="btn btn-outline" onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add New Address
              </button>
            </div>
          )}

          {/* Address form */}
          {showForm && (
            <div className="card" style={{ padding: "18px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, color: "var(--green-900)" }}>
                  {editingId ? "Edit Address" : "New Address"}
                </h2>
                {addresses.length > 0 && (
                  <button
                    onClick={() => { setShowForm(false); setEditingId(null); setErrors({}); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", fontSize: "20px", lineHeight: 1 }}
                  >×</button>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Address type */}
                <div className="form-group">
                  <label className="form-label">Address Type</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {(["Home", "Work", "Other"] as Address["type"][]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, type: t }))}
                        style={{
                          flex: 1, padding: "8px", border: `1.5px solid ${form.type === t ? "var(--green-600)" : "var(--gray-200)"}`,
                          borderRadius: "var(--radius-sm)", background: form.type === t ? "var(--green-50)" : "var(--white)",
                          color: form.type === t ? "var(--green-700)" : "var(--gray-600)",
                          fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                        }}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input {...field("fullName")} placeholder="Rajesh Kumar" />
                    {errors.fullName && <span className="form-error">⚠ {errors.fullName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input {...field("phone")} placeholder="9876543210" maxLength={10} inputMode="numeric" />
                    {errors.phone && <span className="form-error">⚠ {errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address Line 1 *</label>
                  <input {...field("addressLine1")} placeholder="House / Flat no., Street name" />
                  {errors.addressLine1 && <span className="form-error">⚠ {errors.addressLine1}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Address Line 2</label>
                  <input {...field("addressLine2")} placeholder="Landmark, Area (optional)" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input {...field("city")} placeholder="Mumbai" />
                    {errors.city && <span className="form-error">⚠ {errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input {...field("pincode")} placeholder="400001" maxLength={6} inputMode="numeric" />
                    {errors.pincode && <span className="form-error">⚠ {errors.pincode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select {...field("state")} className={`form-input form-select${errors.state ? " error" : ""}`}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="form-error">⚠ {errors.state}</span>}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  style={{ marginTop: "4px" }}
                >
                  {editingId ? "Update Address" : "Save & Use This Address"}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Tip */}
          {addresses.length === 0 && !showForm && (
            <p style={{ textAlign: "center", fontSize: "13px", color: "var(--gray-400)", padding: "20px" }}>
              No saved addresses. Add one above.
            </p>
          )}
        </div>
      </div>

      {/* Sticky bottom actions */}
      <div className="sticky-actions">
        <Link href="/" className="btn btn-ghost">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back
        </Link>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!selectedAddressId || showForm}
          title={!selectedAddressId ? "Select or save an address first" : ""}
        >
          Next: Payment
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </>
  );
}
