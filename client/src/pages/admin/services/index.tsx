import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/app/utils/axios";
import { Service } from "@/app/types/serviceTypes";
import { AdminLayoutContainer } from "@/pages/components/admin-layout";
import { SearchServices } from "@/pages/components/search-services";
import { ServiceList } from "./service-list";
import "@/app/css/services-styles.css";


const ServicesManagement = () => {
  const router = useRouter();
  const [ services, setServices ] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await axios.get("/services");
      setServices(response.data);
    }

    fetchServices();
  }, []);

  return (
    <AdminLayoutContainer>
      <h2>Manage services</h2>
      <div className="info">Hover the mouse over service's name to see its details.</div>
      <button onClick={() => router.push("/admin/services/service-form")}>add new</button>
      <SearchServices setServices={setServices} />
      <ServiceList services={services} setServices={setServices}/>
    </AdminLayoutContainer>
  );
}

export default ServicesManagement;