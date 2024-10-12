'use client';

import Navbar from '@/components/Dashboard/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useCreateCategory from '@/hooks/api/category/useCreateCategory';
import useDeleteCategory from '@/hooks/api/category/useDeleteCategory';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { PropertyCategorySchema } from './schemas/PropertyCategorySchema';
import PropertyCategoryList from './components/PropertyCategoryList';

interface CreatePropertyPageProps {
  propertyCategoryId: number;
}

const CategoryPage = ({ propertyCategoryId }: CreatePropertyPageProps) => {
  const session = useSession();
  const { mutateAsync: createCategory, isPending } = useCreateCategory(
    Number(session.data?.user.id),
  );

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: PropertyCategorySchema,
    onSubmit: async (values) => {
      await createCategory(values);
    },
  });

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900">
        {/* Main Dashboard Content */}
        <section className="p-6 container max-w-7xl mx-auto space-y-10">
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div>
                {/* Contoh Konten Utama */}
                <h5 className="font-semibold mb-3 text-center md:text-left">
                  Add Category
                </h5>
                <Input
                  name="name"
                  type="text"
                  placeholder="Add category"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!formik.touched.name && !!formik.errors.name ? (
                  <p className="text-xs text-red-500">{formik.errors.name}</p>
                ) : null}
                <Button className="mt-3 w-full">
                  {isPending ? 'Loading...' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
          <div>
            <PropertyCategoryList propertyCategoryId={propertyCategoryId} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
