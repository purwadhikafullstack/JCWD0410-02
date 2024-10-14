'use client';

import useAxios from '@/hooks/useAxios';
import { useRouter } from 'next/navigation';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import { Property } from '@/types/property';
import { useState } from 'react';

interface PropertyOption {
  label: string;
  value: string;
}

const Autocomplete = () => {
  const router = useRouter();
  const [isClearable, setIsClearable] = useState(true);
  const { axiosInstance } = useAxios();

  const getPropertyOptions = async (inputText: string) => {
    const { data } = await axiosInstance.get('/property', {
      params: { search: inputText, take: 20 },
    });

    return data?.data.map((property: Property) => ({
      label: property.title,
      value: property.id,
    }));
  };

  const loadOptions = debounce(
    (inputText: string, callback: (option: PropertyOption[]) => void) => {
      getPropertyOptions(inputText).then((option) => callback(option));
    },
    500,
  );

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: 'none',
      borderRadius: '8px',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#999',
      fontStyle: 'italic',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#396ee4' : 'white',
      color: state.isSelected ? 'white' : '#333',
      ':hover': {
        backgroundColor: '#f0f0f0',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#333',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }),
  };

  return (
    <div className="bg-white p-1 rounded-xl">
      <p className="font-semibold text-center text-[#294791] mb-1">Hotel</p>
      <AsyncSelect
        isClearable={isClearable}
        styles={customStyles}
        placeholder="Search hotel..."
        className="mx-auto w-full"
        loadOptions={loadOptions}
        onChange={(property) => router.push(`/property/${property?.label}`)}
      />
    </div>
  );
};

export default Autocomplete;
