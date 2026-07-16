import { loadStripe } from '@stripe/stripe-js';

// Khởi tạo Stripe một lần duy nhất ngoài component để tránh re-create
// Publishable Key (pk_test_...) — an toàn để đặt phía FE
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default stripePromise;
