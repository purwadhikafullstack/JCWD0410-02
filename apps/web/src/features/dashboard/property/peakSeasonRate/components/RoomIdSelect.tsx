import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetRooms } from '@/hooks/api/room/useGetRooms';
import { useSession } from 'next-auth/react';
import { FC } from 'react';

interface FormSelectProps {
  setFieldValue: any;
}

export const RoomIdSelect: FC<FormSelectProps> = ({ setFieldValue }) => {
  const session = useSession();
  const { data, isPending } = useGetRooms({
    take: 100,
  });

  return (
    <Select onValueChange={(value) => setFieldValue('roomId', value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Room" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your Room List</SelectLabel>
          {data?.data.map((room, index) => {
            return (
              <SelectItem key={index} value={String(room.id)}>
                {room.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
