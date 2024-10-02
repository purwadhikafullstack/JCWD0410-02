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
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleConfirm = async (data: { confirm: boolean }) => {
    await confirmPayment({ transactionId: transaction.id, confirm: data.confirm });
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
          <div className="p-4">
            <h4 className="text-lg font-semibold">
              Confirm Payment for {transaction.user.name}
            </h4>
            <p>Property: {transaction.room.property.title}</p>
            <p>Total: {transaction.total}</p>

            {!canConfirmOrDecline && (
              <p className="text-red-500 mt-2">
                This transaction cannot be modified. It is either already
                processed or awaiting payment.
              </p>
            )}

            <form onSubmit={handleSubmit(handleConfirm)}>
              <div className="flex justify-between mt-4">
                <label>
                  <input
                    type="radio"
                    value="true"
                    {...register('confirm')}
                    disabled={!canConfirmOrDecline} 
                  />
                  Confirm
                </label>

                <label>
                  <input
                    type="radio"
                    value="false"
                    {...register('confirm')}
                    disabled={!canConfirmOrDecline} 
                  />
                  Decline
                </label>
              </div>

              {errors.confirm && (
                <p className="text-red-500 mt-2">{errors.confirm.message}</p>
              )}

              <button
                type="submit"
                className={`px-4 py-2 rounded-md mt-4 ${
                  canConfirmOrDecline
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!canConfirmOrDecline} 
              >
                Submit
              </button>
            </form>

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
