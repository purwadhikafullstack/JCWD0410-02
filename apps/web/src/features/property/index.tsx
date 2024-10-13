'use client';
import { Badge } from '@/components/ui/badge';
import useGetProperty from '@/hooks/api/property/useGetProperty';
import Image from 'next/image';
import { FC, useState } from 'react';
import { GoStarFill } from 'react-icons/go';
import { Skeleton } from '@/components/ui/skeleton';
import CreateReviewModal from '@/components/Dashboard/ReviewTenantModal';
import useGetPropertyReviews from '@/hooks/api/property/useGetReviewProperty';
import FacilitiesList from './components/FacilitiesList';
import PropertyDetailList from './components/PropertyDetailList';
import ReviewItem from './components/Review';
import PropertyMap from './components/Map';

interface PropertyDetailPageProps {
  propertySlug: string;
}

const PropertyDetailPage: FC<PropertyDetailPageProps> = ({ propertySlug }) => {
  const { data, isPending } = useGetProperty(propertySlug);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const { data: reviewsData, isLoading: reviewsLoading, refetch } = useGetPropertyReviews({
    propertyId: data?.id ?? 0,
    page: 1,
    take: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const lat = data?.latitude;
  const long = data?.longitude;
  const zoom = 16;

  const averageRating = reviewsData?.data?.length
    ? reviewsData.data.reduce((sum, review) => sum + review.rating, 0) / reviewsData.data.length
    : 0;

  if (isPending || reviewsLoading) {
    return (
      <div className="container max-w-7xl mx-auto my-28 px-3 md:px-0 md:grid gap-5">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
        ))}
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto my-28 px-3 md:px-0">
      <section>
        <div className="relative h-[500px] rounded-xl overflow-hidden">
          {data?.propertyImages?.[0]?.imageUrl && (
            <Image src={data?.propertyImages[0].imageUrl} alt="Property Image" className="object-cover" fill />
          )}
        </div>
        <h2 className="font-semibold text-2xl mt-5">{data?.title}</h2>
        <div className="flex items-center gap-1 mt-3">
          <div className="flex items-center gap-1">
            <GoStarFill className="text-[#fbae2c]" />
            <p className="text-sm font-medium">{averageRating.toFixed(1)}</p>
          </div>
          <Badge variant="secondary">{data?.propertycategory?.name || 'N/A'}</Badge>
          <p>| by {data?.tenant?.name || 'Unknown Tenant'}</p>
        </div>
        <div className="border-t-2 mt-5 border-gray-200"></div>
        <h3 className="font-semibold text-xl mt-5">Description</h3>
        <p className="mt-2 text-justify">{data?.description || 'No description available.'}</p>
        <h3 className="font-semibold text-xl mt-5">Main Facilities</h3>
        {/* Pastikan data selalu berupa array */}
        <FacilitiesList facilities={data?.propertyFacilities || []} />
      </section>

      {/* Ganti dari Map ke PropertyMap */}
      {lat && long && <PropertyMap lat={lat} long={long} zoom={zoom} />}

      <section className="mt-10 space-y-5">
        <h3 className="font-semibold text-xl">Available Room Types in {data?.title || 'this property'}</h3>
        <div className="grid md:grid-cols-2">
          <PropertyDetailList propertySlug={propertySlug} />
        </div>
      </section>

      <section className="mt-10 space-y-5">
        <h3 className="font-semibold text-xl">Reviews in {data?.title || 'this property'}</h3>
        <div className="grid md:grid-cols-2">
          {reviewsData?.data?.length ? (
            reviewsData.data.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onReply={(id) => {
                  setSelectedReviewId(id);
                  setModalOpen(true);
                }}
              />
            ))
          ) : (
            <p>No reviews available for this property.</p>
          )}
        </div>
      </section>

      {isModalOpen && (
        <CreateReviewModal
          transaction={null}
          reviewId={selectedReviewId}
          closeModal={() => setModalOpen(false)}
          refetch={refetch} 
        />
      )}
    </main>
  );
};

export default PropertyDetailPage;