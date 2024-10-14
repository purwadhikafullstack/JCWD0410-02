'use client';
import BestDeals from '@/components/BestDeals';
import { DatePickerWithRange } from '@/components/DateRangePicker';
import { Jumbotron } from '@/components/Jumbotron';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetPropertiesByQuery } from '@/hooks/api/searchProperty/useGetPropertiesByQuery';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PropertyList from './components/PropertyList';
import { FilterSchema } from './schemas/FilterSchema';

interface SearchPropertyOption {
  label: string;
  value: string;
}

const HomePage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    guest: 2,
  });

  const {
    data: dataSearch,
    isPending: pendingSearch,
    refetch: refetchPropertiesByQuery,
  } = useGetPropertiesByQuery({
    page,
    take: 10,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    guest: searchParams.guest,
    title: searchParams.title,
  });

  const formik = useFormik({
    initialValues: searchParams,
    validationSchema: FilterSchema,
    onSubmit: async (values) => {
      const newValues = {
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        guest: Number(values.guest),
      };

      setSearchParams(newValues);

      const query = new URLSearchParams({
        startDate: newValues.startDate.toUTCString(),
        endDate: newValues.endDate.toUTCString(),
        guest: String(newValues.guest),
        title: newValues.title,
      }).toString();

      router.push(`/property/search?${query}`);
    },
  });

  useEffect(() => {
    refetchPropertiesByQuery();
  }, [searchParams, page]);

  const onPageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <main>
      <Jumbotron />
      <div className="grid md:grid-cols-3 bg-slate-100 border-2 p-2 rounded-xl max-w-7xl mx-auto mt-20 items-center gap-2">
        <div className="bg-slate-100 p-1 rounded-xl">
          <p className="font-semibold text-center text-[#294791] mb-1">
            Property
          </p>
          <Input
            name="title"
            type="text"
            placeholder="Search Property Name"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {!!formik.touched.title && !!formik.errors.title ? (
            <p className="text-xs text-red-500">{formik.errors.title}</p>
          ) : null}
        </div>
        <DatePickerWithRange setFieldValue={formik.setFieldValue} />
        <div className="bg-slate-100 p-1 rounded-xl">
          <p className="font-semibold text-center text-[#294791] mb-1">Who</p>
          <Input
            name="guest"
            type="number"
            placeholder="guest"
            value={formik.values.guest}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {!!formik.touched.guest && !!formik.errors.guest ? (
            <p className="text-xs text-red-500">{formik.errors.guest}</p>
          ) : null}
        </div>
      </div>
      <div className="container max-w-7xl mx-auto mt-3 text-center">
        <Button
          className="w-full"
          disabled={pendingSearch}
          onClick={() => formik.handleSubmit()}
        >
          {pendingSearch ? 'Loading...' : 'Search'}
        </Button>
      </div>
      <div className="my-20">
        <PropertyList />
      </div>
      <div className="mt-20 pb-20">
        <BestDeals />
      </div>
    </main>
  );
};

export default HomePage;
