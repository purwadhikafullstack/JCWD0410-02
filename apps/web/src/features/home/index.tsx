import { Jumbotron } from '@/components/Jumbotron';

const HomePage = () => {
  return (
    <div>
      <Jumbotron />
      <div>
        <div className="w-full overflow-hidden">
          <div className="absolute z-[15] flex flex-col gap-12 items-center justify-center inset-0 h-[85vh] md:h-[70vh]">
            <div className="drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)] font-bold w-[60%] text-3xl md:text-5xl lg:w-full text-center text-white">
              Find the accommodation of your next adventure
            </div>
          </div>
        </div>
        <div
          id="bigCard"
          className="relative w-full mt-[-35px] bg-white py-16 z-10 rounded-[30px]"
        >
          <div className="w-[80vw] mx-auto ">
            {/* <ExploreCity></ExploreCity> */}
            {/* <FeaturedRooms listings={listings}></FeaturedRooms> */}
            {/* <BestDeals></BestDeals> */}
            {/* <WhyRoomer></WhyRoomer> */}
          </div>
        </div>
        {/* <Newsletter></Newsletter> */}
      </div>
    </div>
  );
};

export default HomePage;
