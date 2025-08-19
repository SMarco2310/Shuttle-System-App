import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentFailed() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed ❌
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, your payment was not successful. Please try again or contact
          support if the issue persists.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/booking"
            className="px-6 py-3 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
          >
            Retry Payment
          </a>
          <a
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
          >
            Go Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
