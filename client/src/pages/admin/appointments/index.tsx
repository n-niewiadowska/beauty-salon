import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "@/app/utils/axios";
import { connectToClient } from "@/app/utils/mqttClient";
import { GeneralAppointment, AppointmentStates } from "@/app/types/appointmentTypes";
import { AdminLayoutContainer } from "@/pages/components/admin-layout";
import { FaTrash } from "react-icons/fa"; 
import "@/app/css/appointment-styles.css";


const AppointmentsManagement = () => {
  const [ appointments, setAppointments ] = useState<GeneralAppointment[]>([]);
  const [ sortOrder, setSortOrder ] = useState("desc");

  useEffect(() => {
    const client = connectToClient();

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/appointments/admin/all?sort=${sortOrder}`);
        setAppointments(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();

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
  }, [sortOrder]);

  const router = useRouter();

  const handleAcceptance = async (appointment: GeneralAppointment) => {
    const confirmation = window.confirm("Do you want to accept this appointment?");

    try {
      if (confirmation) {
        await axios.put(`/appointments/${appointment._id}/accept`);
        alert(`You accepted the appointment ${appointment._id}.`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleEdit = (appointment: GeneralAppointment) => {
    router.push({
      pathname: "/admin/appointments/edit-form",
      query: { id: appointment._id }
    });
  }

  const handleDelete = async (appointment: GeneralAppointment) => {
    const confirmation = window.confirm("Are you sure you want to delete this appointment?");
    
    try {
      if (confirmation) {
        await axios.delete(`/appointments/admin/${appointment._id}/delete`);

        setAppointments(prev => prev.filter(a => a._id !== appointment._id));
        alert("Appointment deleted successfully.");
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <AdminLayoutContainer>
      <div>
        <div className="sort-appointments">
          <label>Sort appointments:</label>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <option value="desc">From newest</option>
            <option value="asc">From oldest</option>
          </select>
        </div>
        <div className="appointments">
          {appointments.map(appointment => (
            <div className="single-appointment" key={appointment._id}>
              <div className="appointment-info">
                <p><b>Appointment #{appointment._id}</b></p>
                <p>Booked by <u>{appointment.userName} {appointment.userSurname}</u></p>
                <p>{appointment.serviceName} on {new Date(appointment.date).toLocaleString()}</p>
                <p>Approximate duration and price: {appointment.duration} minutes, {appointment.price}$</p>
              </div>
              <div className="state-management">
                <p>{appointment.state}</p>
                {appointment.state !== AppointmentStates.ACCEPTED && (
                <button onClick={() => handleAcceptance(appointment)}>accept</button>
                )}
                <button onClick={() => handleEdit(appointment)}>edit</button>
                <button onClick={() => handleDelete(appointment)}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayoutContainer>
  );
}

export default AppointmentsManagement;