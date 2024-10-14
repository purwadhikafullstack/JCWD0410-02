'use client';
import FormInput from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useDeleteRoom from '@/hooks/api/room/useDeleteRoom';
import useGetRoom from '@/hooks/api/room/useGetRoom';
import useUpdateRoom from '@/hooks/api/room/useUpdateRoom';
import { useFormik } from 'formik';
import { ChangeEvent, FC, useRef, useState } from 'react';

interface RoomDetailPageProps {
  roomId: number;
}

const UpdateRoomPage: FC<RoomDetailPageProps> = ({ roomId }) => {
  const { mutateAsync: updateRoom, isPending } = useUpdateRoom(roomId);
  const { mutateAsync: deleteRoom, isPending: deletePending } = useDeleteRoom();
  const { data, isPending: dataIsPending } = useGetRoom(roomId);

  const formik = useFormik({
    initialValues: {
      name: data?.name || '',
      stock: data?.stock || 0,
      price: data?.price || 0,
      guest: data?.guest || 0,
      propertyId: data?.propertyId || null,
    },
    onSubmit: async (values) => {
      await updateRoom({
        ...values,
        propertyId: Number(values.propertyId),
      });
    },
    enableReinitialize: true,
  });



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
        
          <div className="grid md:grid-cols-4 w-full gap-7 items-end">
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
          </div>
          
          <div className="flex justify-end">
            <Button disabled={isPending}>
              {isPending ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
        <div className="flex justify-end mt-3 mr-28 md:-mt-10">
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
