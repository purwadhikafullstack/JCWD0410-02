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
import { FormikHandlers } from 'formik';
import { FC } from 'react';
import { useGetProperties } from '@/hooks/api/property/useGetProperties';

interface FormSelectProps {
  setFieldValue: any;
}

export const PropertyIdSelect: FC<FormSelectProps> = ({ setFieldValue }) => {
  const session = useSession();
  const { data, isPending } = useGetProperties({
    take: 100,
  });

  return (
    <Select onValueChange={(value) => setFieldValue('propertyId', value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Property" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your Property List</SelectLabel>
          {data?.data
            .filter(
              (property) => property.tenantId === Number(session.data?.user.id),
            )
            .map((property, index) => {
              return (
                <SelectItem key={index} value={String(property.id)}>
                  {property.title}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
