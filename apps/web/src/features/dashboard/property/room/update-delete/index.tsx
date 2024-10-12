'use client';
import FormInput from '@/components/FormInput';
import FormTextarea from '@/components/FormTextArea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import useGetRoom from '@/hooks/api/room/useGetRoom';
import useUpdateRoom from '@/hooks/api/room/useUpdateRoom';
import { useFormik } from 'formik';
import Image from 'next/image';
import { ChangeEvent, FC, useRef, useState } from 'react';
import { PropertyIdSelect } from '../create/components/PropertyIdSelect';
import useDeleteRoom from '@/hooks/api/room/useDeleteRoom';

interface RoomDetailPageProps {
  roomId: number;
}

const UpdateRoomPage: FC<RoomDetailPageProps> = ({ roomId }) => {
  const { mutateAsync: updateRoom, isPending } = useUpdateRoom(roomId);
  const { mutateAsync: deleteRoom, isPending: deletePending } = useDeleteRoom();
  const { data, isPending: dataIsPending } = useGetRoom(roomId);
  const [selectedImage, setSelectedImage] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: data?.name || '',
      stock: data?.stock || 0,
      price: data?.price || 0,
      guest: data?.guest || 0,
      propertyId: data?.propertyId || null,
      imageUrl: null,
      title: data?.roomFacilities[0]?.title || '',
      description: data?.roomFacilities?.[0]?.description || '',
      room_facilities: [{ title: '', description: '' }],
    },
    onSubmit: async (values) => {
      await updateRoom({
        ...values,
        propertyId: Number(values.propertyId),
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
        Error: Room data not found
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
              <Label>Room Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={onChangeImage}
                ref={imageRef}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-5 w-full gap-7 items-end">
            <FormInput
              name="name"
              label="Room Name"
              type="text"
              placeholder="Room Name"
              value={formik.values.name}
              isError={!!formik.touched.name && !!formik.errors.name}
              error={formik.errors.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <FormInput
              name="stock"
              label="Stock"
              placeholder="Stock room available"
              type="number"
              value={formik.values.stock}
              isError={!!formik.touched.stock && !!formik.errors.stock}
              error={formik.errors.stock}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <FormInput
              name="price"
              label="Price"
              type="number"
              placeholder="price"
              value={formik.values.price}
              isError={!!formik.touched.price && !!formik.errors.price}
              error={formik.errors.price}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <FormInput
              name="guest"
              label="Guest"
              type="number"
              placeholder="guest"
              value={formik.values.guest}
              isError={!!formik.touched.guest && !!formik.errors.guest}
              error={formik.errors.guest}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <PropertyIdSelect setFieldValue={formik.setFieldValue} />
          </div>
          <FormInput
            name="title"
            label="Room Facility Name"
            type="text"
            placeholder="Room Facility Name"
            value={formik.values.title}
            isError={!!formik.touched.title && !!formik.errors.title}
            error={formik.errors.title}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <FormTextarea
            name="description"
            label="Description of Room Facility"
            placeholder="Description of Room Facility"
            value={formik.values.description}
            isError={
              !!formik.touched.description && !!formik.errors.description
            }
            error={formik.errors.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
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
              await deleteRoom(roomId);
            }}
          >
            {deletePending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default UpdateRoomPage;
