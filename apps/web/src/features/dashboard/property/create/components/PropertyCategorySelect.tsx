import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useGetCategory from '@/hooks/api/category/useGetCategory';
import { useSession } from 'next-auth/react';
import { FC } from 'react';

interface FormSelectProps {
  setFieldValue: any;
}

export const PropertyCategorySelect: FC<FormSelectProps> = ({
  setFieldValue,
}) => {
  const session = useSession();
  const { data, isPending } = useGetCategory({
    userId: session.data?.user.id,
  });

  return (
    <Select
      onValueChange={(value) => setFieldValue('propertyCategoryId', value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select property category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your Category List</SelectLabel>
          {data?.data.map((category, index) => {
            return (
              <SelectItem key={index} value={String(category.id)}>
                {category.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
