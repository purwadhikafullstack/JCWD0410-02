'use client';
import AddGuest from '@/components/AddGuest';
import BestDeals from '@/components/BestDeals';
import { DatePickerWithRange } from '@/components/DateRangePicker';
import { Jumbotron } from '@/components/Jumbotron';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PropertyList from './components/PropertyList';

const HomePage = () => {
  return (
    <main>
      <Jumbotron />
      <div className="grid md:grid-cols-3 bg-white shadow-inner p-2 rounded-xl max-w-7xl mx-auto mt-20 items-center gap-2">
        {/* <SEARCH HOTEL /> */}
        <div className="bg-white p-1 rounded-xl">
          <p className="font-semibold text-center text-[#294791] mb-1">Hotel</p>
          <Input
            type="text"
            placeholder="Search Hotel"
            className="border-none text-base"
          />
        </div>
        <DatePickerWithRange />
        {/* <ADD GUEST /> */}
        <div className="bg-white p-1 rounded-xl">
          <p className="font-semibold text-center text-[#294791] mb-1">Who</p>
          <Input
            type="number"
            placeholder="Add guest"
            className="border-none text-base"
          />
        </div>
      </div>
      <div className="container max-w-7xl mx-auto mt-3 text-center">
        <Button className="w-full">Search</Button>
      </div>
      <div className="my-20">
        <PropertyList />
      </div>
      <div className="my-20">
        <BestDeals />
      </div>
    </main>
  );
};

export default HomePage;
