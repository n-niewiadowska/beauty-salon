import axios from "@/app/utils/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { SearchServiceSchema } from "@/app/utils/yup-schemas/searchSchema";
import { Categories, SortServices } from "@/app/types/serviceTypes";
import { SearchServicesProps } from "@/app/types/propsTypes";
import { FaSearch } from "react-icons/fa";


export const SearchServices = ({ setServices }: SearchServicesProps) => {

  return (
    <>
      <h3>Search services</h3>
      <div>
        <Formik
          initialValues={{ name: "", category: "", sort: SortServices.NONE }}
          validationSchema={SearchServiceSchema}
          onSubmit={(values, { setSubmitting }) => {
            axios.get("/services", { params: values })
              .then(response => {
                setServices(response.data);
                setSubmitting(false);
              })
              .catch(error => {
                console.error(error);
                setSubmitting(false);
              })
            }}
          >
            {() => (
            <Form className="search-form">
              <div className="form-field">
                <label>Name:</label>
                <Field name="name" as="input" />
              </div>
              <div className="form-field">
                <label>Category:</label>
                <Field name="category" as="select">
                  <option value="">Choose a category</option>
                  {Object.values(Categories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Field>
              </div>
              <div className="form-field">
                <label>Sort:</label>
                <Field name="sort" as="select">
                  <option value={SortServices.NONE}>-</option>
                  <option value={SortServices.NAME_ASC}>Name (A-Z)</option>
                  <option value={SortServices.NAME_DESC}>Name (Z-A)</option>
                  <option value={SortServices.PRICE_ASC}>Price (Low to High)</option>
                  <option value={SortServices.PRICE_DESC}>Price (High to Low)</option>
                </Field>
                <div className="error-msg">
                  <ErrorMessage name="sort" />
                </div>
              </div>
              <button type="submit"><FaSearch /></button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}