"use client";

import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto p-8 text-center">

      <h1 className="text-3xl font-bold mb-6">
        Confirm Payment
      </h1>

      <p className="mb-6">
        Review your order and proceed with payment.
      </p>

      <button
        onClick={() => router.push("/success")}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Pay Securely
      </button>

    </div>
  );
}