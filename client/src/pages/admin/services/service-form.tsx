import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/app/utils/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ServiceSchema } from "@/app/utils/yup-schemas/serviceSchema";
import { Categories, Service } from "@/app/types/serviceTypes";
import { AdminLayoutContainer } from "@/pages/components/admin-layout";


const ServiceForm = () => {
  const router = useRouter();
  const id = router.query.id;
  const action = id ? "edit" : "add";
  const [ service, setService ] = useState<Service | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (id) {
          const response = await axios.get(`/services/${id}`);
          setService(response.data);
        }
      } catch (error: any) {
        alert(error.response.data);
      }
    }

    fetchService();
  });

  return (
    <AdminLayoutContainer>
      <h2>{action} the service</h2>
      <div className="service-form">
        <Formik
          initialValues={{ name: "", category: "", description: "", price: 0, lengthInMinutes: 0, availability: true }}
          validationSchema={ServiceSchema}
          onSubmit={async (values) => {
            try{
              if (action === "add") {
                await axios.post("/services/new", values);
                alert("New appointment added!");
              } else {
                await axios.put(`/services/${id}`, values);
                alert("Appointment updated successfully!");
              }
              router.push("/admin/services");
            } catch (error: any) {
              alert(error.response.data);
            }
          }}
        >
          {() => (
            <Form className="manage-service">
              <div className="form-field">
                <label>Name*:</label>
                <Field name="name" as="input" />
                <div className="error-msg">
                  <ErrorMessage name="name" />
                </div>
              </div>
              <div className="form-field">
                <label>Category*:</label>
                <Field name="category" as="select">
                  <option value="">Choose a category</option>
                  {Object.values(Categories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Field>
                <div className="error-msg">
                  <ErrorMessage name="category" />
                </div>
              </div>
              <div className="form-field">
                <label>Description:</label>
                <Field name="description" as="input" type="text" />
              </div>
              <div className="form-field">
                <label>Price*:</label>
                <Field name="price" as="input" type="number" />
                <div className="error-msg">
                  <ErrorMessage name="price" />
                </div>
              </div>
              <div className="form-field">
                <label>Length in minutes*:</label>
                <Field name="lengthInMinutes" as="input" type="number" />
                <div className="error-msg">
                  <ErrorMessage name="lengthInMinutes" />
                </div>
              </div>
              <div className="form-field">
                <label>Available:</label>
                <Field name="availability" type="radio" value="true" />
                <label htmlFor="available-true">true</label>
                <Field name="availability" type="radio" value="false" />
                <label htmlFor="available-false">false</label>
              </div>
              <div>* - field required.</div>
              <div className="buttons">
                <button type="submit">{action}</button>
                <button onClick={() => router.push("/admin/services")}>cancel</button>
              </div>
            </Form>
          )}
        </Formik>
        { service && (
          <div className="current-service-info">
            <p>You are editing:</p>
            <ul>
              <li>{service.name}</li>
              <li>{service.category}</li>
              <li>{service.description}</li>
              <li>{service.price}$</li>
              <li>{service.lengthInMinutes} minutes</li>
              <li>{service.availability ? "Available" : "Unavailable"}</li>
            </ul>
          </div>
        )}
      </div>
    </AdminLayoutContainer>
  );
}

export default ServiceForm;