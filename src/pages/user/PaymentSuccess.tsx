import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "../../service/redux/store";
import { paymentSuccess } from "../../service/Api/settingsApi"; // Import the function

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("session_id");
  const userId = useSelector(selectUserId); // Get user ID from Redux store

  useEffect(() => {
    if (!paymentId || !userId) {
      console.error("❌ Missing Payment ID or User ID:", { paymentId, userId });
      return;
    }

    console.log("🚀 Confirming payment with:", { paymentId, userId });

    const confirmPayment = async () => {
      try {
        const response = await paymentSuccess(paymentId, userId);
        console.log("✅ Payment confirmed:", response);
      } catch (error) {
        console.error("❌ Error confirming payment:", error);
      }
    };

    confirmPayment();
  }, [paymentId, userId]);

  return <h2>Processing Payment...</h2>;
};

export default PaymentSuccess;
