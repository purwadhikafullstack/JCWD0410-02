'use client';
import { Input } from '@/components/ui/input';
import { PropertyCategorySelect } from './components/PropertyCategorySelect';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import FormInput from '@/components/FormInput';
import FormTextarea from '@/components/FormTextArea';
import { ChangeEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useCreateProperty from '@/hooks/api/property/useCreateProperty';

const CreatePropertyPage = () => {
  const { mutateAsync: createProperty, isPending } = useCreateProperty();

  const formik = useFormik({
    initialValues: {
      title: '',
      slug: '',
      description: '',
      latitude: '',
      longitude: '',
      imageUrl: null,
      propertyCategoryId: null,
    },
    onSubmit: async (values) => {
      await createProperty({
        ...values,
        propertyCategoryId: Number(values.propertyCategoryId),
      });
    },
  });

  console.log(formik.values);

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

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
    formik.setFieldValue('title', title);
    formik.setFieldValue('slug', slug);
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
            />
            <PropertyCategorySelect setFieldValue={formik.setFieldValue} />
          </div>
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

export default CreatePropertyPage;
