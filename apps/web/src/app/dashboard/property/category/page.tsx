import CategoryPage from '@/features/dashboard/property/category';

const PropertyCategory = ({ params }: { params: { id: number } }) => {
  return <CategoryPage propertyCategoryId={params.id} />;
};

export default PropertyCategory;
