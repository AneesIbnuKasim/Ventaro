import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-page px-4">
      <div className="max-w-2xl w-full bg-card rounded-xl shadow-sm p-10 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-semibold mb-3">
          Thanks for shopping with Ventaro.
        </h1>

        <p className="text-secondary mb-2">
          Your purchase with Order ID
          <span className="font-medium"> #{orderId}</span> has been
          successfully placed.
        </p>

        <p className="text-secondary mb-8">
          Your order will be delivered on time. Keep shopping with us.
        </p>

        {/* Action */}
        <Button
          onClick={() => navigate("/profile/orders")}
         variant='custom'
        >
          MY ORDERS
        </Button>
      </div>
    </div>
  );
}
