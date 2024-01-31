import { useState, useEffect } from "react";
import axios from "@/app/utils/axios";
import { Service } from "@/app/types/serviceTypes";
import { MainLayoutContainer } from "../components/main-layout";
import { SearchServices } from "../components/search-services";
import { ServiceList } from "./service-list";
import "@/app/css/services-styles.css";


const ServicesPage = () => {
  const [ services, setServices ] = useState<Service[]>([]);

  useEffect(() => {
    axios.get("/services")
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <MainLayoutContainer>
      <SearchServices setServices={setServices} />
      <ServiceList services={services} />
    </MainLayoutContainer>
  );
}

export default ServicesPage;