import { useState } from "react";
import { useRouter } from "next/router";
import axios from "@/app/utils/axios";
import { AdminServiceListProps } from "@/app/types/propsTypes";
import { Service } from "@/app/types/serviceTypes";
import { ServiceDetails } from "@/pages/components/service-details";
import { FaTrash } from "react-icons/fa";


export const ServiceList = ({ services, setServices }: AdminServiceListProps) => {
  const router = useRouter();
  const [ activeService, setActiveService ] = useState<Service | null>(null);

  const handleDelete = async (service: Service) => {
    const confirmation = window.confirm("Are you sure you want to delete this service?");
    try {
      if (confirmation) {
        await axios.delete(`/services/${service._id}`);
        setServices(prev => prev.filter(s => s._id !== service._id));
        alert("Service deleted successfully!");
      }
    } catch (error) { 
      console.error(error);
    }
  }
  
  return (
    <div className="service-list">
      {services.length === 0 ? <p>No services found.</p> : (
        <>
          {services.map(service => (
            <div key={service._id} className="service">
              <div className="service-management">
                <p 
                  onMouseEnter={() => setActiveService(service)}
                  onMouseLeave={() => setActiveService(null)}
                >
                  <b>{service.name} </b>
                  {!service.availability && <span>(unavailable!)</span>}
                </p>
                <div className="buttons">
                  <button onClick={() => router.push(`/admin/services/service-form?id=${service._id}`)}>
                    edit
                  </button>
                  <button onClick={() => handleDelete(service)}><FaTrash /></button>
                </div>
              </div>
              {activeService === service && <ServiceDetails service={service} />}
            </div>
          ))}
        </>
      )}
    </div>
  );
}