'use client';
import FormInput from '@/components/FormInput';
import FormTextarea from '@/components/FormTextArea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useCreateRoom from '@/hooks/api/room/useCreateRoom';
import { useFormik } from 'formik';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { PropertyIdSelect } from './components/PropertyIdSelect';

const CreateRoomPage = () => {
  const { mutateAsync: createRoom, isPending } = useCreateRoom();

  const formik = useFormik({
    initialValues: {
      name: '',
      stock: 0,
      price: 0,
      guest: 2,
      propertyId: null,
      imageUrl: null,
      title: '',
      description: '',
      room_facilities: [{ title: '', description: '' }],
    },
    onSubmit: async (values) => {
      await createRoom({
        ...values,
        propertyId: Number(values.propertyId),
      });
    },
  });

  const [selectedImage, setSelectedImage] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);
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
              {isPending ? 'Loading...' : 'Create'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateRoomPage;
