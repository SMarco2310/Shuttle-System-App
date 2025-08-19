import PaystackPop from "@paystack/inline-js";
import axios from "axios";

function Checkout({ bookingId, email, amount }) {
  const handlePay = async () => {
    try {
      // 1️⃣ Ask your backend to initialize payment
      const response = await axios.post(
        "http://localhost:5000/api/payment/init",
        {
          email,
          amount,
          bookingId,
        },
      );

      const { authorization_url, reference } = response.data;

      // 2️⃣ Open Paystack popup
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: "pk_test_xxxxx", // <-- use your PUBLIC KEY here
        email: email,
        amount: amount * 100, // Paystack takes amount in kobo (₦) or pesewas (GH₵)
        reference: reference, // from your backend init
        onSuccess: async (transaction) => {
          console.log("Payment success:", transaction);

          // 3️⃣ Optionally verify with your backend
          await axios.post("http://localhost:5000/api/payment/verify", {
            reference: transaction.reference,
          });

          alert("Payment successful!");
        },
        onCancel: () => {
          alert("Payment cancelled.");
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handlePay}>Pay Now</button>;
}

export default Checkout;
