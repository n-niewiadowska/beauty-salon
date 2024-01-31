import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "@/app/utils/axios";
import { UserAppointment } from "@/app/types/appointmentTypes";
import { UserLayoutContainer } from "@/pages/components/user-layout";
import { DatePickerComponent } from "@/pages/components/datepicker";
import { BookingForm } from "@/pages/components/booking-form";


const EditAppointmentForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [ appointment, setAppointment ] = useState<UserAppointment | null>(null);
  const [ date, setDate ] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (typeof id === "string") {
          const response = await axios.get(`/appointments/${id}`);
          const appointment: UserAppointment = response.data;

          setAppointment(appointment);
          if (appointment.date) {
            setDate(new Date(appointment.date));
          }
        }
      } catch (error: any) {
        alert(error.response.data);
      }
    }

    fetchAppointment();
  }, [id]);

  const handleEdit = async (values: {category: string, service: string}) => {
    try {
      const response = await axios.put(`/appointments/${router.query.id}/edit`, {
        serviceName: values.service,
        date: date
      });
      
      console.log(response.data);
      alert("Your appointment was edited!");
      router.push("/user/appointments");
    } catch (error) {
      console.error(error);
    }
  } 

  console.log(appointment?.date);
  console.log(date);

  return (
    <UserLayoutContainer>
      {appointment ? (
        <>
          <h2>Edit your appointment</h2>
          <div className="details">Your current details: {appointment?.serviceName}, {appointment?.date}</div>
          <DatePickerComponent date={date} select={setDate} />
          <BookingForm date={date} action="edit" onSubmit={handleEdit} />
          <button onClick={() => router.push("/user/appointments")}>cancel</button>
        </>
      ) : (
        <h2>No appointment found.</h2>
      )}
    </UserLayoutContainer>
  );
}

export default EditAppointmentForm;