import { useState, useEffect } from "react";
import axios from "@/app/utils/axios";
import { AdminLayoutContainer } from "@/pages/components/admin-layout";
import { FaTrash } from "react-icons/fa";


const LogsPage = () => {
  const [ logs, setLogs ] = useState<string>("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("/users/logs");
        setLogs(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    
    fetchLogs();
  }, []);

  const handleDelete = async () => {
    const confirmation = window.confirm("Do you want do clear the logs file?");

    if (confirmation) {
      await axios.delete("/users/logs/delete");
      setLogs("");
      alert("File cleared successfully!");
    }
  }

  return (
    <AdminLayoutContainer>
      <h2>Logs</h2>
      <div className="logs-clearing">
        <p>Click the button if you want to clear logs:</p>
        <button onClick={() => handleDelete()}><FaTrash /></button>
      </div>
      <pre>{logs}</pre>
    </AdminLayoutContainer>
  );
}

export default LogsPage;