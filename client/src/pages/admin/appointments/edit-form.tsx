import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "@/app/utils/axios";
import { UserAppointment } from "@/app/types/appointmentTypes";
import { AdminLayoutContainer } from "@/pages/components/admin-layout";
import { DatePickerComponent } from "../../components/datepicker";
import { BookingForm } from "../../components/booking-form";


const EditAppointmentForm = () => {
  const router = useRouter();
  const id = router.query.id;
  const [ appointment, setAppointment ] = useState<UserAppointment | null>(null);
  const [ date, setDate ] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`/appointments/${id}`);
        const appointment: UserAppointment = response.data;

        setAppointment(appointment);
        setDate(new Date(appointment.date));
      } catch (error) {
        console.error(error);
      }
    }

    fetchAppointment();
  }, [id]);

  const handleEdit = async (values: {category: string, service: string}) => {
    try {
      const response = await axios.put(`/appointments/admin/${id}/edit`, {
        serviceName: values.service,
        date: date
      });
      
      console.log(response.data);
      alert("This appointment was edited!");
      router.push("/admin/appointments")
    } catch (error) {
      console.error(error);
    }
  } 

  return (
    <AdminLayoutContainer>
      <div>
        <h2>Edit the appointment #{appointment?._id}</h2>
        <div className="details">Current details: {appointment?.serviceName}, {appointment?.date}</div>
        <DatePickerComponent date={date} select={setDate} />
        <BookingForm date={date} action="edit" onSubmit={handleEdit} />
        <button onClick={() => router.push("/admin/appointments")}>cancel</button>
      </div>
    </AdminLayoutContainer>
  );
}

export default EditAppointmentForm;