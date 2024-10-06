import PeakSeasonRatePage from '@/features/dashboard/property/peakSeasonRate';
import React from 'react';

const PeakSeasonRate = ({ params }: { params: { id: number } }) => {
  return <PeakSeasonRatePage roomId={params.id} />;
};

export default PeakSeasonRate;
