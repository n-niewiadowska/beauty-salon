import { GeneralStats } from "@/app/types/statisticTypes";


export const GeneralStatistics = ({ generalStats }: { generalStats: GeneralStats }) => {

  return (
    <div>
      <h3>General statistics</h3>
      <table className="stats-table">
      <tbody>
        <tr>
          <td>Total number of appointments</td>
          <td>{generalStats.totalAppointments}</td>
        </tr>
        <tr>
          <td>Average time spent in the salon</td>
          <td>{generalStats.avgTime} minutes</td>
        </tr>
        <tr>
          <td>Total money earned</td>
          <td>{generalStats.totalPrice}$</td>
        </tr>
        <tr>
          <td>Average price of the appointment</td>
          <td>{generalStats.avgPrice}$</td>
        </tr>
      </tbody>
    </table>
    </div>
  );
};