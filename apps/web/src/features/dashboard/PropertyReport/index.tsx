"use client"
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  PropertyReport,
  RoomReport,
  PropertyFacility,
  RoomFacility,
  SoldOutDate,
} from '@/types/propertyreport';
import { DatePickerWithRange } from '@/components/Dashboard/DateRange';
import useGetPropertyReport from '@/hooks/api/salesandanalysis/useGetPropertyReport';

const PropertyReportFeature = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  useEffect(() => {
    setDateRange({
      from: new Date(),
      to: new Date(),
    });
  }, []);

  const startDate = dateRange.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : undefined;
  const endDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;

  const { data, isLoading, error } = useGetPropertyReport({
    startDate,
    endDate,
  });

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAvailabilityFilter(e.target.value);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredData =
    availabilityFilter === 'All'
      ? data
      : data?.map((property) => ({
          ...property,
          rooms: property.rooms.filter(
            (room) =>
              (availabilityFilter === 'Available' && room.availability === 'Available') ||
              (availabilityFilter === 'Non Available' && room.availability === 'Non Available')
          ),
        })).filter((property) => property.rooms.length > 0);

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex space-x-4 mb-6">
        <DatePickerWithRange
          className="w-64"
          onDateChange={(range) => handleDateRangeChange(range)}
          from={dateRange.from}
          to={dateRange.to}
        />

        <select
          className="border p-2 rounded"
          value={availabilityFilter}
          onChange={handleAvailabilityChange}
        >
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Non Available">Non Available</option>
        </select>
      </div>

      {filteredData?.length === 0 ? (
        <p className="text-center text-gray-500">
          No data available for the selected date range and filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredData?.map((property: PropertyReport) => (
            <div
              key={property.propertyId}
              className="border p-4 rounded-lg shadow-sm"
            >
              <h2 className="text-lg font-semibold">{property.propertyName}</h2>
              <p>{property.propertyDescription}</p>

              <p>
                <strong>Category:</strong>{' '}
                {property.propertyCategory.categoryName}
              </p>

              <h3 className="font-medium">Facilities:</h3>
              <ul className="list-disc ml-6">
                {property.propertyFacilities.map(
                  (facility: PropertyFacility) => (
                    <li key={facility.facilityId}>
                      {facility.facilityTitle}: {facility.facilityDescription}
                    </li>
                  ),
                )}
              </ul>

              {property.rooms.length > 0 ? (
                property.rooms.map((room: RoomReport) => (
                  <div key={room.roomId} className="mt-4">
                    <h3 className="font-medium">{room.roomName}</h3>
                    <h4 className="font-medium">Room Facilities:</h4>
                    <ul className="list-disc ml-6">
                      {room.roomFacilities.map((facility: RoomFacility) => (
                        <li key={facility.facilityId}>
                          {facility.facilityTitle}:{' '}
                          {facility.facilityDescription}
                        </li>
                      ))}
                    </ul>

                    {room.availability === 'Non Available' ? (
                      <ul className="list-disc ml-6">
                        {room.soldOutDates.map(
                          (dateInfo: SoldOutDate, index: number) => (
                            <li key={index}>
                              {format(
                                new Date(dateInfo.startDate),
                                'LLL dd, yyyy',
                              )}{' '}
                              -{' '}
                              {format(
                                new Date(dateInfo.endDate),
                                'LLL dd, yyyy',
                              )}
                              : {dateInfo.reason}
                            </li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p>Room is available</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No rooms available for this property.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyReportFeature;
