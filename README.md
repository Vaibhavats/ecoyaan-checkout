Ecoyaan Checkout Flow

A simplified checkout flow built using Next.js, React, and Tailwind CSS that guides users from reviewing their cart to completing a simulated payment.

This project was created as part of the Frontend Engineering Interview Assignment for Ecoyaan.

Features

Server-side rendered cart data

Multi-step checkout flow

Shipping address form with validation

Payment confirmation screen

Order success page

Responsive UI using Tailwind CSS

Tech Stack

Next.js 16 (App Router)

React

TypeScript

Tailwind CSS

Architecture & Design Choices
1. Next.js App Router

The project uses Next.js App Router to organize pages and routes.

/               → Cart summary
/checkout       → Shipping address form
/payment        → Payment confirmation
/success        → Order success page

Each route is implemented using file-based routing inside the app directory.

2. Server-Side Rendering (SSR)

Cart data is loaded from a local JSON file during the server render phase:

data/cartData.json

The cart summary page reads this data on the server and renders the product list along with subtotal and total calculations.

3. Component Structure

Project structure:

app/
  checkout/
  payment/
  success/
  page.tsx

data/
  cartData.json

components/
context/

The flow is designed to be modular and easy to extend.

4. Form Handling

The checkout form uses React state (useState) to capture user input.

Basic validation includes:

Required fields

Email input type validation

Phone number length validation

5. Navigation Between Steps

The checkout steps are implemented using Next.js router navigation:

Cart → Checkout → Payment → Success

useRouter() is used to programmatically navigate between pages.

How to Run Locally
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ecoyaan-checkout.git
cd ecoyaan-checkout
2. Install dependencies
npm install
3. Start the development server
npm run dev
4. Open in browser
http://localhost:3000
Live Demo

Deployed on Vercel:

https://your-vercel-url.vercel.app
