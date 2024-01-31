import { useEffect, useState } from "react";
import axios from "@/app/utils/axios";
import { UserAppointment } from "@/app/types/appointmentTypes";
import { UserLayoutContainer } from "@/pages/components/user-layout";
import { AppointmentList } from "./appointment-list";
import "@/app/css/appointment-styles.css";


const AppointmentHistory = () => {
  const [ appointments, setAppointments ] = useState<UserAppointment[]>([]);

  useEffect(() => {
    axios.get("/appointments/user/all")
      .then(response => {
        console.log(response.data);
        setAppointments(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <UserLayoutContainer>
      <h2>My appointment history</h2>
      <div className="appointments-head">
        You can see all the appointments you booked, edit them and confirm them.
      </div>
      <AppointmentList appointments={appointments} setAppointments={setAppointments} />
    </UserLayoutContainer>
  );
}

export default AppointmentHistory;