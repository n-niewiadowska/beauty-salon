import { useEffect, useState } from "react";
import axios from "@/app/utils/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { IndividualStats } from "@/app/types/statisticTypes";
import { IndividualStatsProps } from "@/app/types/propsTypes";


export const IndividualStatsChart = ({ user, setShowStats }: IndividualStatsProps) => {
  const [ stats, setStats ] = useState<IndividualStats | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`/appointments/admin/statistics/${user.nickname}`);
        setStats(response.data);
      } catch (error: any) {
        alert(error.response.data);
      }
    }

    fetchStatistics();
  })

  const data = [
    { name: "Total number", value: stats?.totalNumberOfAppointments },
    { name: "Average time", value: stats?.averageTime },
    { name: "Total price", value: stats?.totalPrice },
    { name: "Average price", value: stats?.averagePrice }
  ];

  return (
    <>
      <button onClick={() => setShowStats(false)}>Go back</button>
      <h3>Statistics for {user.name} {user.surname}</h3>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#367AA9" />
      </BarChart>
      <p>Last Appointment Date: 
        {stats?.lastAppointmentDate ? new Date(stats?.lastAppointmentDate).toLocaleDateString() : ""}
      </p>
    </>
  );
};