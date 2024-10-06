'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface UpdateRoomPayload {
  name: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number;
  imageUrl: File | null;
  title: string;
  description: string;
  room_facilities?: { title: string; description: string }[];
}

const useUpdateRoom = (id: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateRoomPayload) => {
      const editRoomForm = new FormData();

      editRoomForm.append('name', payload.name);
      editRoomForm.append('stock', String(payload.stock));
      editRoomForm.append('price', String(payload.price));
      editRoomForm.append('guest', String(payload.guest));
      editRoomForm.append('propertyId', String(payload.propertyId));
      editRoomForm.append('imageUrl', payload.imageUrl!);
      editRoomForm.append('title', payload.title);
      editRoomForm.append('description', payload.description);

      if (payload.room_facilities && payload.room_facilities.length > 0) {
        payload.room_facilities.forEach((room_facilities, index) => {
          editRoomForm.append(
            `room_facilities[${index}][title]`,
            room_facilities.title,
          );
          editRoomForm.append(
            `room_facilities[${index}][description]`,
            room_facilities.description,
          );
        });
      }

      const { data } = await axiosInstance.patch(`/room/${id}`, editRoomForm);
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['room'] });
      toast.success('Update room success');
      router.push('/dashboard/property/room');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useUpdateRoom;
