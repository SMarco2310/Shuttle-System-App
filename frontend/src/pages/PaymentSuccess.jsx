import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. Thank you for your
          purchase!
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/"
            className="px-6 py-3 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
          >
            Go Home
          </a>
          <a
            href={`/user/profile/${JSON.parse(localStorage.getItem("user")).userId}`}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
          >
            View My Bookings
          </a>
        </div>
      </motion.div>
    </div>
  );
}
