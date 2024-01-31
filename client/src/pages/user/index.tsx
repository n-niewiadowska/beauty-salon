import { useState } from "react";
import { useUsers } from "@/app/store/contexts";
import axios from "@/app/utils/axios";
import { UserLayoutContainer } from "../components/user-layout";
import { DatePickerComponent } from "../components/datepicker";
import { BookingForm } from "../components/booking-form";


const UserPage = () => {
  const { user } = useUsers() || {};
  const [ selectedDate, setSelectedDate ] = useState<Date | null>(null);

  const handleNewAppointment = async (values: {category: string, service: string}) => {
    try {
      const response = await axios.post("/appointments/new", {
        serviceName: values.service,
        date: selectedDate
      });

      console.log(response.data);
      alert("Your appointment was booked!");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <UserLayoutContainer>
      <h2>Hello, {user?.name} {user?.surname}!</h2>
      <div>Click the logo image from every place to come back to this page.</div>
      <h3>Book your appointment here!</h3>
      <DatePickerComponent date={selectedDate} select={setSelectedDate} />
      <BookingForm date={selectedDate} action="book" onSubmit={handleNewAppointment} />
    </UserLayoutContainer>
  );
}

export default UserPage;