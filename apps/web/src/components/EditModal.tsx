import React from "react";
import useConfirmPayment from '@/hooks/api/transaction-tenant/useConfirmPayment';

interface EditModalProps {
  transaction: any; // Can be refined based on type
  closeModal: () => void;
  refetch: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ transaction, closeModal, refetch }) => {
  const confirmPaymentMutation = useConfirmPayment();

  // Handle Confirm Payment
  const handleConfirm = (confirm: boolean) => {
    confirmPaymentMutation.mutate(
      { transactionId: transaction.id, confirm },
      {
        onSuccess: () => {
          refetch();
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
            <h3 className="text-lg font-semibold">Confirm Payment for {transaction.user.name}</h3>
            <p>Property: {transaction.room.property.title}</p>
            <p>Total: {transaction.total}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleConfirm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Confirm
              </button>
              <button
                onClick={() => handleConfirm(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Decline
              </button>
            </div>

            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
