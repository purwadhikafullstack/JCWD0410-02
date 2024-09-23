import React from "react";
import useCancelOrder from "@/hooks/api/transaction-tenant/useCancelOrder";

interface CancelOrderModalProps {
  transaction: any;
  closeModal: () => void;
  refetch: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ transaction, closeModal, refetch }) => {
  const cancelOrderMutation = useCancelOrder();

  // Handle cancel order
  const handleCancelOrder = () => {
    cancelOrderMutation.mutate(
      { transactionId: transaction.id },
      {
        onSuccess: () => {
          refetch(); // Refresh data
          closeModal(); // Close modal after success
        },
      }
    );
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-500 bg-opacity-75 fixed inset-0" onClick={closeModal}></div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl sm:max-w-lg w-full relative z-20">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Cancel Order</h3>
            <p>Are you sure you want to cancel the order for {transaction.user.name}?</p>
            <p>Property: {transaction.room.property.title}</p>
            <p>Total: {transaction.total}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleCancelOrder}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Confirm Cancel
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
