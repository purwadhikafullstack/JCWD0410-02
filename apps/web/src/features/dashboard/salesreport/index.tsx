"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { SalesReport } from "@/types/report";
import useGetSalesReport from "@/hooks/api/salesandanalysis/useGetSalesReport";
import { format } from "date-fns";
import { DatePickerWithRange } from "@/components/Dashboard/DateRange";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesReportChart = () => {
  const [propertyTitle, setPropertyTitle] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(),
  });
  const [sortBy, setSortBy] = useState<string>("totalSales");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const startDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  const { data, isLoading, error } = useGetSalesReport({
    propertyTitle,
    startDate,
    endDate,
    sortBy,
  });

  const noData = !data || data.length === 0;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  const selectProperty = (title: string | undefined) => {
    setPropertyTitle(title); 
    setDropdownOpen(false); 
  };

  
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from !== dateRange.from || range.to !== dateRange.to) {
      setDateRange(range); 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown-container")) {
        setDropdownOpen(false); 
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); 
    };
  }, [dropdownOpen]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const propertyList = data?.map((report: SalesReport) => report.property) || [];

  const filteredData = propertyTitle
    ? data?.filter((report: SalesReport) => report.property === propertyTitle)
    : data;
  const chartData = {
    labels: filteredData?.map((report: SalesReport) => report.property) || [], 
    datasets: [
      {
        label: sortBy === "totalSales" ? "Transactions" : "Total Sales",
        data:
          sortBy === "totalSales"
            ? filteredData?.map((report: SalesReport) => report.totalSales) || [] 
            : filteredData?.map((report: SalesReport) => report.transactions) || [], 
        backgroundColor:
          sortBy === "totalSales" ? "rgba(75, 192, 192, 0.2)" : "rgba(153, 102, 255, 0.2)",
        borderColor:
          sortBy === "totalSales" ? "rgba(75, 192, 192, 1)" : "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: noData ? "No Sales Data Available" : "Sales Report",
      },
    },
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex space-x-4 mb-6">
        <div className="relative dropdown-container">
          <button
            className="border-gray-300 rounded-lg shadow-sm px-4 py-2 bg-white"
            onClick={toggleDropdown}
          >
            {propertyTitle || "Property"}
          </button>
          {dropdownOpen && (
            <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md">
              <li
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => selectProperty(undefined)}
              >
                All Properties
              </li>
              {propertyList.map((title, index) => (
                <li
                  key={index}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => selectProperty(title)}
                >
                  {title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <DatePickerWithRange
          className="w-64"
          onDateChange={(range) => handleDateRangeChange(range)}
          from={dateRange.from}
          to={dateRange.to}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border-gray-300 rounded-lg shadow-sm px-4 py-2"
        >
          <option value="totalSales">Transactions</option>
          <option value="transactions">Total Sales</option>
        </select>
      </div>

      {noData ? (
        <p className="text-center text-gray-500">No transactions available for the selected date range.</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};
export default SalesReportChart;
