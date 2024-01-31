import axios from "@/app/utils/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { opinionSchema } from "@/app/utils/yup-schemas/opinionSchema";
import ReactStars from "react-rating-stars-component";


export const OpinionForm = () => {
  
  return (
    <div className="opinion-form">
      <div className="form-header">
        <h2>Add your opinion</h2>
        <p className="header-desc">Already had an appointment? Share your experience!</p>
      </div>
      <Formik
        initialValues={{ name: "Anonymous", rate: 0, description: "" }}
        validationSchema={opinionSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          axios.post("/opinions/new", values)
            .then(() => {
              setSubmitting(false);
              resetForm();
            })
            .catch(error => {
              console.error(error);
              setSubmitting(false);
            });
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="form-field-name">
              <label>Name:</label>
              <Field name="name" as="input" />
            </div>
            <div className="form-field-stars">
              <label>Rate your experience:</label>
              <ReactStars
                count={5}
                value={values.rate}
                onChange={(newRate: number) => setFieldValue("rate", newRate)}
                size={24}
                activeColor="#D4AE4C"
              />
              <div className="error-msg">
                <ErrorMessage name="rate" />
              </div>
              </div>
              <div className="form-field-description">
                <label>Leave your opinion here:</label>
                <Field name="description" as="input" className="text-desc" />
              </div>
            <button type="submit" disabled={isSubmitting}>add</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}