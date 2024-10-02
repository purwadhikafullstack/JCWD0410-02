'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
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
  from: Date | undefined;
  to: Date | undefined;
  onDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export function DatePickerWithRange({
  className,
  from,
  to,
  onDateChange,
}: DatePickerWithRangeProps) {
  const handleDateChange = (newDate: DateRange | undefined) => {
    onDateChange({ from: newDate?.from, to: newDate?.to });
  };

  return (
    <div className="bg-white p-1 rounded-xl">
      <div className={cn('grid gap-2', className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'justify-center text-left font-normal',
                !from && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {from ? (
                to ? (
                  <>
                    {format(from, 'LLL dd, y')} - {format(to, 'LLL dd, y')}
                  </>
                ) : (
                  format(from, 'LLL dd, y')
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
              defaultMonth={from}
              selected={{ from, to }}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
