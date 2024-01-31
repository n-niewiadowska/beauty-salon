import { useState, useEffect } from "react";
import axios from "@/app/utils/axios";
import { DatePickerProps } from "@/app/types/propsTypes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export const DatePickerComponent = ({ date, select }: DatePickerProps) => {
  const [ excludeTimes, setExcludeTimes ] = useState<Date[] | null>(null);

  const handleDateChange = (date: Date) => {
    const isTimeBooked = excludeTimes?.some(bookedTime =>
      bookedTime.getTime() === date.getTime()
    );
  
    if (isTimeBooked) {
      alert("This time is already booked. Please select a different time.");
    } else {
      select(date);
    }
  };

  const filterWeekends = (date: Date) => {
    return date.getDay() !== 0 && date.getDay() !== 6;
  };

  const initialExcludeTimes = [
    ...Array.from({ length: 8 * 60 }, (_, i) => new Date(2022, 1, 1, Math.floor(i / 60), i % 60)),
    ...Array.from({ length: 7 * 60 }, (_, i) => new Date(2022, 1, 1, Math.floor(i / 60) + 17, i % 60)),
  ];

  useEffect(() => {
    const fetchBookedTimes = async () => {
      try {
        const response = await axios.get("/appointments/booked");
        const excludeTimes = response.data.flatMap((appointment: {start: string, end: string}) => {
          const start = new Date(appointment.start);
          const end = new Date(appointment.end);
          const times = [];
          for (let time = start; time <= end; time.setMinutes(time.getMinutes() + 1)) {
            times.push(new Date(time));
          }
          return times;
        });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        for (let time = startOfDay; time <= endOfDay; time.setMinutes(time.getMinutes() + 1)) {
          if (time.getHours() < 8 || time.getHours() >= 17) {
            excludeTimes.push(new Date(time));
          }
        }
        setExcludeTimes(excludeTimes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookedTimes();
  }, []);

  return (
    <div className="appointment-datepicker">
      <p>Choose a date and time:</p>
      <DatePicker
        selected={date}
        onChange={handleDateChange}
        filterDate={filterWeekends}
        showTimeSelect
        excludeTimes={initialExcludeTimes || []}
      />
    </div>
  )
}