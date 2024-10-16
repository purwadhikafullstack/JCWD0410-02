'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerWithRangeProps {
  className?: string;
  onChange: (dates: { startDate: string; endDate: string } | null) => void;
}

export function DatePickerWithRange({
  className,
  onChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    if (selectedDate?.from) {
      const startDate = selectedDate.from;
      const endDate = selectedDate.to ?? selectedDate.from;
      const difference = differenceInCalendarDays(endDate, startDate);

      if (difference < 1) {
        const adjustedEndDate = addDays(startDate, 1);
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(adjustedEndDate, 'yyyy-MM-dd');
        setDate({ from: startDate, to: adjustedEndDate });
        onChange({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      } else {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        setDate(selectedDate);
        onChange({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      }
    } else {
      onChange(null);
      setDate(undefined);
    }
  };

  return (
    <div className="bg-white p-1 rounded-xl">
      <p className="font-semibold text-center text-[#294791] mb-1">Duration</p>
      <div className={cn('grid gap-2', className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'justify-center text-left font-normal',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
