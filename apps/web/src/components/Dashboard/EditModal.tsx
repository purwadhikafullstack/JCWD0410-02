import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import useConfirmPayment from '@/hooks/api/transaction-tenant/useConfirmPayment';
import { StatusTransaction } from '@/types/transaction';

const validationSchema = Yup.object().shape({
  confirm: Yup.boolean().required('You must confirm or decline the payment'),
});

interface EditModalProps {
  transaction: any;
  closeModal: () => void;
  refetch: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  transaction,
  closeModal,
  refetch,
}) => {
  const { mutateAsync: confirmPayment } = useConfirmPayment();
  const {
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleConfirm = async (confirm: boolean) => {
    await confirmPayment({ transactionId: transaction.id, confirm });
    refetch();
    closeModal();
  };

  const canConfirmOrDecline =
    transaction.status === StatusTransaction.WAITING_FOR_PAYMENT_CONFIRMATION;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-gray-500 bg-opacity-75 fixed inset-0"
          onClick={closeModal}
        ></div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl sm:max-w-lg w-full relative z-20">
          <div className="p-6">
            <h4 className="text-lg font-semibold mb-4">
              Confirm Payment for {transaction.user.name}
            </h4>
            <p className="mb-2">Property: {transaction.room.property.title}</p>
            <p className="mb-6">Total: {transaction.total}</p>

            {!canConfirmOrDecline && (
              <p className="text-red-500 mb-4">
                This transaction cannot be modified. It is either already
                processed or awaiting payment.
              </p>
            )}

            <form onSubmit={handleSubmit(() => handleConfirm(true))}>
              <div className="flex justify-between space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => handleConfirm(true)}
                  disabled={!canConfirmOrDecline}
                  className={`flex-1 px-4 py-2 rounded-md text-white transition-all duration-300 ${
                    canConfirmOrDecline
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirm(false)}
                  disabled={!canConfirmOrDecline}
                  className={`flex-1 px-4 py-2 rounded-md text-white transition-all duration-300 ${
                    canConfirmOrDecline
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Decline
                </button>
              </div>

              {errors.confirm && (
                <p className="text-red-500 mb-4">{errors.confirm.message}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
