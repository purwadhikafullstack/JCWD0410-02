'use client';
import FormInput from '@/components/FormInput';
import FormTextarea from '@/components/FormTextArea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import useDeleteProperty from '@/hooks/api/property/useDeleteProperty';
import useGetPropertyTenant from '@/hooks/api/property/useGetPropertyTenant';
import useUpdateProperty from '@/hooks/api/property/useUpdateProperty';
import { useFormik } from 'formik';
import Image from 'next/image';
import { ChangeEvent, FC, useRef, useState } from 'react';
import { EditPropertyCategorySelect } from '../management/components/EditPropertyCategorySelect';

interface PropertyDetailPageProps {
  propertyId: number;
}

const UpdatePropertyPage: FC<PropertyDetailPageProps> = ({ propertyId }) => {
  const { mutateAsync: updateProperty, isPending } =
    useUpdateProperty(propertyId);
  const { mutateAsync: deleteProperty, isPending: deletePending } =
    useDeleteProperty();
  const { data, isPending: dataIsPending } = useGetPropertyTenant(propertyId);
  const [selectedImage, setSelectedImage] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      title: data?.title || '',
      slug: data?.slug || '',
      description: data?.description || '',
      latitude: data?.latitude || '',
      longitude: data?.longitude || '',
      imageUrl: null,
      propertyCategoryId: data?.propertycategory.id || null,
    },
    onSubmit: async (values) => {
      await updateProperty({
        ...values,
        propertyCategoryId: Number(values.propertyCategoryId),
      });
    },
    enableReinitialize: true,
  });

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      formik.setFieldValue('imageUrl', files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const removeSelectedImage = () => {
    formik.setFieldValue('imageUrl', null);
    setSelectedImage('');
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
    formik.setFieldValue('title', title);
    formik.setFieldValue('slug', slug);
  };

  if (dataIsPending) {
    return (
      <div className="p-6 container max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-[300px] w-full rounded-2xl overflow-hidden bg-slate-200" />
        <Skeleton className="h-[300px] w-full rounded-2xl overflow-hidden bg-slate-200" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 container max-w-7xl mx-auto space-y-6">
        Error: Property data not found
      </div>
    );
  }

  return (
    <div>
      {/* Main Dashboard Content */}
      <section className="p-6 container max-w-7xl mx-auto">
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-5">
            {selectedImage ? (
              <>
                <div className="relative w-full h-[350px] overflow-hidden rounded-lg">
                  <Image
                    src={selectedImage}
                    alt="Property Image"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button onClick={removeSelectedImage} variant={'destructive'}>
                  Remove Image
                </Button>
              </>
            ) : null}
            <div className="max-w-xs mx-auto">
              <Label>Property Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={onChangeImage}
                ref={imageRef}
              />
            </div>
          </div>
          <FormInput
            name="title"
            label="Property Name"
            type="text"
            placeholder="Property Name"
            value={formik.values.title}
            isError={!!formik.touched.title && !!formik.errors.title}
            error={formik.errors.title}
            onBlur={formik.handleBlur}
            onChange={(formik.handleChange, handleTitleChange)}
          />
          <FormInput
            name="slug"
            label="Slug"
            placeholder=""
            type="text"
            value={formik.values.slug}
            isError={!!formik.touched.slug && !!formik.errors.slug}
            error={formik.errors.slug}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            readOnly={true}
          />
          <FormTextarea
            name="description"
            label="Description"
            placeholder="Description"
            value={formik.values.description}
            isError={
              !!formik.touched.description && !!formik.errors.description
            }
            error={formik.errors.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <div className="grid grid-cols-3 w-full gap-7 items-end">
            <FormInput
              name="latitude"
              label="latitude"
              type="text"
              placeholder="latitude"
              value={formik.values.latitude}
              isError={!!formik.touched.latitude && !!formik.errors.latitude}
              error={formik.errors.latitude}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              readOnly
            />
            <FormInput
              name="longitude"
              label="longitude"
              type="text"
              placeholder="longitude"
              value={formik.values.longitude}
              isError={!!formik.touched.longitude && !!formik.errors.longitude}
              error={formik.errors.longitude}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              readOnly
            />
            <EditPropertyCategorySelect setFieldValue={formik.setFieldValue} />
          </div>
          <div className="flex justify-end">
            <Button disabled={isPending}>
              {isPending ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
        <div className="flex justify-end mt-3 md:justify-start md:-mt-10">
          <Button
            disabled={deletePending}
            variant={'destructive'}
            onClick={async () => {
              await deleteProperty(propertyId);
            }}
          >
            {deletePending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default UpdatePropertyPage;
