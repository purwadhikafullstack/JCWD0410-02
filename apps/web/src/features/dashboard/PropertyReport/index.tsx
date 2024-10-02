"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import useGetPropertyReport from "@/hooks/api/salesandanalysis/useGetPropertyReport";
import { PropertyReport, RoomReport, RoomAvailability } from "@/types/propertyreport";
import { DatePickerWithRange } from "@/components/Dashboard/DateRange";

const filterAvailabilityByDate = (
  availability: RoomAvailability[] = [], 
  startDate: Date | undefined, 
  endDate: Date | undefined
) => {
  if (!startDate || !endDate) return availability;
  return availability.filter((item) => {
    const availabilityStart = new Date(item.startDate);
    const availabilityEnd = new Date(item.endDate);
    return availabilityStart >= startDate && availabilityEnd <= endDate;
  });
};

const PropertyReportFeature = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(),
  });

  const startDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  const { data, isLoading, error } = useGetPropertyReport({
    startDate,
    endDate,
  });

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex space-x-4 mb-6">
        <DatePickerWithRange
          className="w-64"
          onDateChange={(range) => handleDateRangeChange(range)}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>

      {data?.length === 0 ? (
        <p className="text-center text-gray-500">No data available for the selected date range.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data?.map((property: PropertyReport) => (
            <div key={property.propertyId} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">{property.propertyName}</h2>
              {property.rooms.length > 0 ? (
                property.rooms.map((room: RoomReport) => {
                  // Pastikan room.availability selalu berupa array
                  const filteredAvailability = filterAvailabilityByDate(
                    Array.isArray(room.availability) ? room.availability : [],
                    dateRange.from,
                    dateRange.to
                  );
                  return (
                    <div key={room.roomId} className="mt-4">
                      <h3 className="font-medium">{room.roomName}</h3>
                      {filteredAvailability.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {filteredAvailability.map((availability, index) => (
                            <li key={index}>
                              {format(new Date(availability.startDate), "LLL dd, yyyy")} -{" "}
                              {format(new Date(availability.endDate), "LLL dd, yyyy")}:{" "}
                              {availability.reason}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No availability for the selected date range.</p>
                      )}
                    </div>
                  );
                })
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
