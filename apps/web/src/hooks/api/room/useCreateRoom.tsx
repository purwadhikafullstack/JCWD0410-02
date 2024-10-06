'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface CreateRoomPayload {
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

const useCreateRoom = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRoomPayload) => {
      const createRoomForm = new FormData();

      createRoomForm.append('name', payload.name);
      createRoomForm.append('stock', String(payload.stock));
      createRoomForm.append('price', String(payload.price));
      createRoomForm.append('guest', String(payload.guest));
      createRoomForm.append('propertyId', String(payload.propertyId));
      createRoomForm.append('imageUrl', payload.imageUrl!);
      createRoomForm.append('title', payload.title);
      createRoomForm.append('description', payload.description);

      if (payload.room_facilities && payload.room_facilities.length > 0) {
        payload.room_facilities.forEach((room_facilities, index) => {
          createRoomForm.append(
            `room_facilities[${index}][title]`,
            room_facilities.title,
          );
          createRoomForm.append(
            `room_facilities[${index}][description]`,
            room_facilities.description,
          );
        });
      }

      const { data } = await axiosInstance.post('/room/', createRoomForm);
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['room'] });
      toast.success('Create room success');
      router.push('/dashboard/property/room');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useCreateRoom;
