import { FC } from 'react';

interface FacilitiesListProps {
  facilities: any[];
}

const FacilitiesList: FC<FacilitiesListProps> = ({ facilities }) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
    {facilities?.map((facility, idx) => (
      <div key={idx} className="flex items-center gap-3">
        <p>{facility?.title || 'N/A'}</p>
      </div>
    ))}
  </div>
);

export default FacilitiesList;
