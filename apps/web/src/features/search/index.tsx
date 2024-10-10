'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import useGetAllCategoryList from '@/hooks/api/category/useGetCategoryList';
import { useGetPropertiesByQuery } from '@/hooks/api/searchProperty/useGetPropertiesByQuery';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GoStarFill } from 'react-icons/go';

const SearchPropertiesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const title = searchParams.get('title') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const guest = Number(searchParams.get('guest')) || 0;
  const price = Number(searchParams.get('price')) || 0;

  const { data, isPending, refetch } = useGetPropertiesByQuery({
    take: 10,
    page,
    sortBy,
    sortOrder,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    guest,
    title,
    price,
    propertycategory: selectedCategory,
  });

  const {
    data: dataCategory,
    isPending: PendingCategory,
    refetch: refetchCategory,
  } = useGetAllCategoryList();

  useEffect(() => {
    refetch();
  }, [sortBy, sortOrder, selectedCategory, searchParams, page, refetch]);

  const handleSortBy = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handleSortOrder = (value: 'asc' | 'desc') => {
    setSortOrder(value);
    setPage(1);
  };

  const handleCategoryChange = (propertycategory: string) => {
    setSelectedCategory(propertycategory);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (propertycategory) {
      params.set('propertycategory', propertycategory);
    } else {
      params.delete('propertycategory');
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <main className="min-h-screen items-center justify-center p-4">
      <div className="my-[125px] max-w-7xl mx-auto">
        <div className="flex justify-center items-center gap-3">
          <p>Sort by</p>
          <Select onValueChange={handleSortBy} value={sortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
          <p>Filter by:</p>
          <Select onValueChange={handleCategoryChange} value={selectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {dataCategory?.data?.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p>Sort order</p>
          <Select onValueChange={handleSortOrder} value={sortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isPending ? (
          <div className="container max-w-7xl mx-auto my-9 px-3 md:px-0 md:grid gap-5">
            <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
            <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
            <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
          </div>
        ) : data && data.data.length === 0 ? (
          <p className="text-center text-lg font-semibold mt-[10%]">
            No properties found for your search criteria.
          </p>
        ) : (
          data?.data.map((property, index) => (
            <Link href={`/property/${property.slug}`}>
              <Card
                key={index}
                className="overflow-hidden grid md:grid-cols-[1fr_2fr_1fr] mt-9"
              >
                <div className="relative h-[225px] w-full overflow-hidden">
                  <Image
                    src={property.propertyImages[0]?.imageUrl}
                    alt="PropertyImage"
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="py-5 px-10 space-y-7">
                  <h3 className="text-xl font-semibold text-center md:text-left">
                    {property.title}
                  </h3>
                  <p className="line-clamp-3 text-justify">
                    {property.description}
                  </p>
                  <div className="flex gap-3 justify-center md:justify-normal">
                    <Badge>{property.propertycategory.name}</Badge>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium">
                        {property.reviews[0]?.rating ? (
                          <div className="flex items-center gap-1">
                            <GoStarFill className="text-[#fbae2c]" />
                            <p className="text-sm font-medium">
                              {property.reviews[0]?.rating}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <GoStarFill className="text-slate-200" />
                            <p className="text-sm font-medium">0</p>
                          </div>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-5 px-10 border-l-2 place-content-center">
                  <p className="text-center">Start from</p>
                  <h3 className="text-xl font-semibold text-center text-[#396ee4]">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(property.rooms[0]?.price)}
                  </h3>
                  <Button className="w-full mt-5">Choose</Button>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </main>
  );
};

export default SearchPropertiesPage;
