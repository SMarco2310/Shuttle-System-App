import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyPayment() {
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference");

      try {
        const res = await fetch(
          `http://localhost:3000/api/payments/verify/${reference}`,
        );
        const data = await res.json();

        if (data.status === "success") {
          navigate("/"); // go home or show success screen
        } else {
          navigate("/payment-failed");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        navigate("/payment-failed");
      }
    }

    verifyPayment();
  }, [navigate]);

  return <p>Verifying payment, please wait...</p>;
}

export default PaymentSuccess;
