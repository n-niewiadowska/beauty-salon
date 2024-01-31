import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/app/utils/axios";
import { useUsers } from "@/app/store/contexts";
import { GeneralStats, CategoryStats } from "@/app/types/statisticTypes";
import { AdminLayoutContainer } from "../components/admin-layout";
import { GeneralStatistics } from "./statistics/general-stats";
import { CategoryStatsChart } from "./statistics/category-chart";
import "@/app/css/statistics-styles.css";


const AdminPage = () => {
  const { user } = useUsers() || {};
  const [ generalStats, setGeneralStats ] = useState<GeneralStats | null>(null);
  const [ categoryStats, setCategoryStats ] = useState<CategoryStats[] | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("/appointments/admin/statistics");
        setGeneralStats(response.data.generalStats[0]);
        setCategoryStats(response.data.categoryStats);
      } catch (error: any) {
        console.error(error.response.data);
      }
    }

    fetchStatistics();
  }, []);

  return (
    <AdminLayoutContainer>
      <div>
        <h2>Hello, {user?.name} {user?.surname} - our amazing admin!</h2>
        <p>Clicking on the logo will always bring you here :3</p>
        <div>
          <Link href="/admin/statistics" className="normal-link">
            Click here
            </Link> to see individual statistics.
        </div>
      </div>
      <div>
          { generalStats && categoryStats && (
            <div className="statistics">
              <GeneralStatistics generalStats={generalStats} />
              <CategoryStatsChart categoryStats={categoryStats} />
            </div>
          )}
      </div>
    </AdminLayoutContainer>
  );
}

export default AdminPage;