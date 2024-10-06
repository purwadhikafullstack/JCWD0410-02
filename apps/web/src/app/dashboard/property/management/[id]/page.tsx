import UpdatePropertyPage from '@/features/dashboard/property/update';

const UpdateProperty = ({ params }: { params: { id: number } }) => {
  return <UpdatePropertyPage propertyId={params.id} />;
};

export default UpdateProperty;
