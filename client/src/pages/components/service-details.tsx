import { ServiceDetailsProps } from "@/app/types/propsTypes";


export const ServiceDetails = ({ service }: ServiceDetailsProps) => {
  
  return (
    <div>
      <p>This is a service from <b>{service.category}</b> category.</p>
      <p>{service.description}</p>
      <p>Average time: {service.lengthInMinutes} minutes</p>
      <p>Cost of one appointment: {service.price}$</p>
    </div>
  );
}