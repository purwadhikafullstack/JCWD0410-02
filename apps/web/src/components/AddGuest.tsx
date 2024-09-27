import React from 'react';
import { Input } from './ui/input';

const AddGuest = () => {
  return (
    <div className="bg-white p-1 rounded-xl">
      <p className="font-semibold text-center text-[#294791] mb-1">Who</p>
      <Input
        type="number"
        placeholder="Add guest"
        className="border-none text-base"
      />
    </div>
  );
};

export default AddGuest;
