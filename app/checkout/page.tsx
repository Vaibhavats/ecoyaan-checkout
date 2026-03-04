"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [phone, setPhone] = useState("");

  const handleSubmit = (e: any) => {
  e.preventDefault();

  if (phone.length !== 10) {
    alert("Phone must be 10 digits");
    return;
  }

  router.push("/payment");
};

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Shipping Address</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="border p-2 w-full rounded"
          placeholder="Full Name"
          required
        />

        <input
          className="border p-2 w-full rounded"
          type="email"
          placeholder="Email"
          required
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Phone Number"
          onChange={(e)=>setPhone(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="PIN Code"
          required
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="City"
          required
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="State"
          required
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Continue to Payment
        </button>

      </form>
    </div>
  );
}