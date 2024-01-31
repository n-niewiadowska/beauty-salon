import { useState } from "react";
import { ServiceListProps } from "@/app/types/propsTypes";
import { Service } from "@/app/types/serviceTypes";
import { ServiceDetails } from "../components/service-details";


export const ServiceList = ({ services }: ServiceListProps) => {
  const [ activeService, setActiveService ] = useState<Service | null>(null);
  
  return (
    <div className="service-list">
      <p>Hover your mouse over the service length to see its details.</p>
      {services.length === 0 ? <p>No services found.</p> : (
        <>
          {services.map(service => (
            <div key={service._id} className="service">
              <p 
                className="service-name"
                onMouseEnter={() => setActiveService(service)}
                onMouseLeave={() => setActiveService(null)}
              >
                <b>{service.name} </b>
                {!service.availability && <i>(unavailable!)</i>} 
              </p>
              {activeService === service && <ServiceDetails service={service} />}
            </div>
          ))}
        </>
      )}
    </div>
  );
}