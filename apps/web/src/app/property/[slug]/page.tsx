import PropertyDetailPage from '@/features/property';
import React from 'react';

const PropertyDetail = ({ params }: { params: { slug: string } }) => {
  return <PropertyDetailPage propertySlug={params.slug} />;
};

export default PropertyDetail;
