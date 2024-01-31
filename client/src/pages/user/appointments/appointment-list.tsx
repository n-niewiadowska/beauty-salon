import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "@/app/utils/axios";
import { connectToClient } from "@/app/utils/mqttClient";
import { UserAppointment, AppointmentStates } from "@/app/types/appointmentTypes";
import { AppointmentsListProps } from "@/app/types/propsTypes";
import { FaTrash } from "react-icons/fa";


export const AppointmentList = ({ appointments, setAppointments }: AppointmentsListProps) => {
  const router = useRouter();

  useEffect(() => {
    const client = connectToClient();

    const handleNewMessage = (topic: string, message: Buffer) => {
      if (topic === "appointments/stateUpdate") {
        const { appointmentId, newState } = JSON.parse(message.toString());

        setAppointments(appointments => appointments.map(appointment => 
          appointment._id === appointmentId ? { ...appointment, state: newState } : appointment
        ));
      }
    };

    client.on("message", handleNewMessage);
    client.subscribe("appointments/stateUpdate");

    return () => {
      client.off("message", handleNewMessage);
      client.unsubscribe("appointments/stateUpdate");
    }
  })

  const handleConfirmation = async (appointment: UserAppointment) => {
    const confirmation = window.confirm("Do you confirm your appointment?");

    try {
      if (confirmation) {
        await axios.put(`/appointments/${appointment._id}/confirm`);
        alert("Your appointment was confirmed!");
      }
    } catch (error: any) {
      alert(error.response.data);
    }
  }

  const handleEdit = (appointment: UserAppointment) => {
    if (appointment.state === "Accepted") {
      alert("You cannot edit this appointment.");
    } else {
      router.push(`/user/appointments/${appointment._id}`);
    }
  }

  const handleDelete = async (appointment: UserAppointment) => {
    if (appointment.state === "Accepted") {
      alert("You cannot delete an appointment accepted by admin.");
    } else {
      const confirmation = window.confirm("Are you sure you want to delete your appointment?");
    
      try {
        if (confirmation) {
          await axios.delete(`/appointments/${appointment._id}/delete`);

          setAppointments(prev => prev.filter(a => a._id !== appointment._id));
          alert("Appointment deleted successfully.");
        }
      } catch (error: any) {
        alert(error.response.data);
      }
    }
  }

  return (
    <div className="appointments">
      {appointments && appointments.map(appointment => (
        <div key={appointment._id} className="single-appointment">
          <div className="appointment-info">
            <p><b>Appointment #{appointment._id}</b></p>
            <p>{appointment.serviceName} on {new Date(appointment.date).toLocaleString()}</p>
            <p>Approximate duration and price: {appointment.duration} minutes, {appointment.price}$</p>
          </div>
          <div className="state-management">
            <p>{appointment.state}</p>
            {appointment.state === AppointmentStates.BOOKED && (
              <button onClick={() => handleConfirmation(appointment)}>confirm</button>
            )}
            <button onClick={() => handleEdit(appointment)}>edit</button>
            <button onClick={() => handleDelete(appointment)}><FaTrash /></button>
          </div>
        </div>
      ))}
    </div>
  );
}