'use client';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useDeleteCategory from '@/hooks/api/category/useDeleteCategory';
import useGetCategory from '@/hooks/api/category/useGetCategory';
import useUpdateCategory from '@/hooks/api/category/useUpdateCategory';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EditCategoryButton } from './EditCategory';

interface PropertyCategoryPageProps {
  propertyCategoryId: number;
}

const PropertyCategoryList: FC<PropertyCategoryPageProps> = ({
  propertyCategoryId,
}) => {
  const session = useSession();
  const [page, setPage] = useState(1);
  const { data, isPending } = useGetCategory({
    userId: session.data?.user.id,
    take: 10,
  });

  const onPageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const { mutateAsync: deleteCategory, isPending: pendingDelete } =
    useDeleteCategory();
  const { mutateAsync: updateCategory, isPending: pendingUpdate } =
    useUpdateCategory();

  if (isPending) {
    return (
      <div className="container max-w-7xl mx-auto">
        <Skeleton className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-slate-200" />
      </div>
    );
  }

  if (!data) {
    return <h1>Property tidak ditemukan</h1>;
  }
  return (
    <>
      <h5 className="container max-w-7xl mx-auto font-semibold mb-3 text-center md:text-left">
        Category List
      </h5>
      <section className="container max-w-7xl mx-auto bg-white p-5 rounded-lg">
        <Table>
          <TableCaption>A list of your property category</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((category, index) => {
              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="flex items-center gap-3">
                    <Button
                      variant={'destructive'}
                      disabled={pendingDelete}
                      onClick={() => deleteCategory(category.id)}
                    >
                      {pendingDelete ? 'Deleting...' : 'Delete'}
                    </Button>
                    <EditCategoryButton id={category.id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
      <div className="container max-w-7xl mx-auto flex justify-center mt-10">
        <Pagination
          take={data.meta.take}
          total={data.meta.total}
          onPageChange={onPageChange}
          page={page}
        />
      </div>
    </>
  );
};

export default PropertyCategoryList;
