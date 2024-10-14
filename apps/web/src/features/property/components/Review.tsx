import { FC } from 'react';
import { GoStarFill } from 'react-icons/go';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Review } from '@/types/review';

interface ReviewItemProps {
  review: Review;
  onReply: (id: number) => void;
}

const ReviewItem: FC<ReviewItemProps> = ({ review, onReply }) => {
  const isReplied = review.review.includes('Reply:');

  return (
    <div className="grid grid-cols-[1fr_9fr] mb-4">
      <Avatar>
        <AvatarImage />
        <AvatarFallback>{review.user?.name?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      <div>
        <h5 className="font-semibold">{review.user?.name || 'Unknown User'}</h5>
        <div className="flex items-center gap-1">
          <GoStarFill className="text-[#fbae2c]" />
          <p className="text-sm font-medium">{review.rating}</p>
        </div>
        <p className="text-sm font-semibold mt-2">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
        <p className="text-justify">{review.review || 'No review provided.'}</p>
        {!isReplied && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
            onClick={() => onReply(review.id)}
          >
            Reply Review
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
