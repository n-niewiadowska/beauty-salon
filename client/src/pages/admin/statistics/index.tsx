import { useState } from "react";
import { User } from "@/app/types/userTypes";
import { AdminLayoutContainer } from "@/pages/components/admin-layout";
import { SearchUsers } from "./search-users";
import { IndividualStatsChart } from "./individual-chart";


const IndividualStatisticsPage = () => {
  const [ activeUser, setActiveUser ] = useState<User | null>(null);
  const [ showStats, setShowStats ] = useState(false);

  return (
    <AdminLayoutContainer>
      <div className="stats">
        <h2>Individual statistics</h2>
        {activeUser && showStats ? (
          <IndividualStatsChart user={activeUser} setShowStats={setShowStats} />
        ) : (
          <SearchUsers setActiveUser={setActiveUser} setShowStats={setShowStats} />
        )}
      </div>
    </AdminLayoutContainer>
  )
}

export default IndividualStatisticsPage;