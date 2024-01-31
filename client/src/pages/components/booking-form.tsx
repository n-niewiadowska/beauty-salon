import { useState, ChangeEvent } from "react";
import axios from "@/app/utils/axios";
import { Formik, Field, Form } from 'formik';
import { Categories, Service } from "@/app/types/serviceTypes";
import { BookingProps } from "@/app/types/propsTypes";


export const BookingForm = ({ date, action, onSubmit }: BookingProps) => {
  const [ services, setServices ] = useState<Service[]>([]);

  return (
    <div className="booking-div">
      {date && (
        <>
          <b>Choose a service for this appointment:</b>
          <Formik
            initialValues={{ category: "", service: "" }}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="booking-form">
                <Field 
                  as="select" 
                  name="category" 
                  onChange={async (event: ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue('category', event.target.value);
                    const response = await axios.get(`/services?category=${event.target.value}`);
                    setServices(response.data);
                }}>
                  <option value="">Choose a category</option>
                  {Object.values(Categories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Field>
                <Field as="select" name="service">
                  <option value="">Choose the service you want</option>
                  {services.map(service => {
                    if (service.availability) {
                      return (
                        <option key={service._id} value={service.name}>{service.name}</option>
                      );
                    }
                  }
                  )}
                </Field>
                <button type="submit">{action}</button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
}