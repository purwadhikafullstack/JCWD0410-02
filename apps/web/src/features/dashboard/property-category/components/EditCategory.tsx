import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useUpdateCategory from '@/hooks/api/category/useUpdateCategory';
import { useFormik } from 'formik';
import { PropertyCategorySchema } from '../schemas/PropertyCategorySchema';
import { FC } from 'react';

interface EditCategoryButton {
  id: number;
}

export const EditCategoryButton: FC<EditCategoryButton> = ({ id }) => {
  const { mutateAsync: updateCategory, isPending: pendingUpdate } =
    useUpdateCategory();
  const formik = useFormik({
    initialValues: {
      name: '',
      id,
    },
    validationSchema: PropertyCategorySchema,
    onSubmit: async (values) => {
      await updateCategory(values);
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to your category here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                className="col-span-3"
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
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pendingUpdate}>
              {pendingUpdate ? 'Updating...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
