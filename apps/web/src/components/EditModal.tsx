import React from "react";
import useConfirmPayment from '@/hooks/api/transaction-tenant/useConfirmPayment';
import { StatusTransaction } from "@/types/transaction"; // Import enum StatusTransaction

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

  // Periksa apakah status memungkinkan untuk konfirmasi atau penolakan
  const canConfirmOrDecline = transaction.status === StatusTransaction.WAITING_FOR_PAYMENT_CONFIRMATION;

  // Jika status sudah diubah menjadi PROCESSED atau WAITING_FOR_PAYMENT, nonaktifkan tombol
  const isProcessedOrWaitingForPayment = 
    transaction.status === StatusTransaction.PROCESSED ||
    transaction.status === StatusTransaction.WAITING_FOR_PAYMENT;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-500 bg-opacity-75 fixed inset-0" onClick={closeModal}></div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl sm:max-w-lg w-full relative z-20">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Confirm Payment for {transaction.user.name}</h3>
            <p>Property: {transaction.room.property.title}</p>
            <p>Total: {transaction.total}</p>

            {/* Jika status tidak memungkinkan, tampilkan peringatan */}
            {!canConfirmOrDecline && (
              <p className="text-red-500 mt-2">
                This transaction cannot be modified. It is either already processed or awaiting payment.
              </p>
            )}

            <div className="flex justify-between mt-4">
              {/* Tombol Confirm */}
              <button
                onClick={() => handleConfirm(true)}
                className={`px-4 py-2 rounded-md ${
                  canConfirmOrDecline ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!canConfirmOrDecline} // Disable tombol jika status tidak memungkinkan
              >
                Confirm
              </button>

              {/* Tombol Decline */}
              <button
                onClick={() => handleConfirm(false)}
                className={`px-4 py-2 rounded-md ${
                  canConfirmOrDecline ? "bg-red-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!canConfirmOrDecline} // Disable tombol jika status tidak memungkinkan
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
