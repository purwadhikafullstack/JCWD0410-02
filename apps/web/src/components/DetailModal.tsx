import React from 'react';

interface DetailModalProps {
  transaction: any; 
  closeModal: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  transaction,
  closeModal,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-gray-500 bg-opacity-75 fixed inset-0"
          onClick={closeModal}
        ></div>{' '}
        <div className="bg-white rounded-lg overflow-hidden shadow-xl sm:max-w-lg w-full relative z-20">
          <div className="p-4">
            <h4 className="text-lg font-semibold">Transaction Details</h4>
            <p>
              <strong>Name:</strong> {transaction.user.name}
            </p>
            <p>
              <strong>Property:</strong> {transaction.room.property.title}
            </p>
            <p>
              <strong>Room ID:</strong> {transaction.roomId}
            </p>
            <p>
              <strong>Total:</strong> {transaction.total}
            </p>
            <p>
              <strong>Status:</strong> {transaction.status}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(transaction.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Start Date:</strong>{' '}
              {new Date(transaction.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{' '}
              {new Date(transaction.endDate).toLocaleDateString()}
            </p>

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

export default DetailModal;
