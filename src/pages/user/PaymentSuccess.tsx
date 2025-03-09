import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "../../service/redux/store";
import { paymentSuccess } from "../../service/Api/settingsApi";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("session_id");
  const userId = useSelector(selectUserId);
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, success, error

  useEffect(() => {
    if (!paymentId || !userId) {
      setStatus("error");
      return;
    }

    const confirmPayment = async () => {
      try {
        await paymentSuccess(paymentId, userId);
        setStatus("success");
        setTimeout(() => {
          navigate("/dash/settings");
        }, 4000);
      } catch (error) {
        setStatus("error");
      }
    };

    confirmPayment();
  }, [paymentId, userId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full px-8 py-12 bg-white border border-gray-200 rounded-lg shadow-md text-center">
        {status === "processing" && (
          <>
            <div className="animate-pulse mb-6">
              <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-black mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. Thank you for your
              purchase.
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-6 text-sm text-gray-500 break-all overflow-auto max-w-full">
              <p className="font-medium text-gray-700">Payment ID:</p>
              <p className="mt-1 p-2 bg-white rounded-md border border-gray-300 overflow-auto text-xs break-all">
                {paymentId}
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Redirecting to settings in 3 seconds...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="h-16 w-16 flex items-center justify-center mx-auto mb-6 rounded-full bg-gray-100">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something Went Wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't process your payment. Please try again or contact
              support.
            </p>
            <button
              onClick={() => navigate("/dash/settings")}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Return to Settings
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
