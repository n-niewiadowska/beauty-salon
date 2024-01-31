import { Formik, Form, Field } from "formik";
import { useProducts } from "@/app/store/contexts";
import { productTags, productTypes, SortProducts } from "@/app/types/productTypes";
import { filterSchema } from "@/app/utils/yup-schemas/filterProductsSchema";
import { Select } from "@geist-ui/react";


export const FilterForm = () => {
  const { dispatch } = useProducts();

  const initialValues: { name: string; types: string[]; tags: string[]; sort: string } = {
    name: "",
    types: [],
    tags: [],
    sort: "",
  };

  return (
    <nav>
      <h3>Looking for something more specific?</h3>
      <Formik 
        initialValues={initialValues}
        validationSchema={filterSchema}
        onSubmit={(values, { resetForm }) => {
          dispatch({ type: "APPLY_FILTERS", payload: values });
          resetForm();
        }}
      >
        {({ values, setFieldValue, handleBlur }) => (
          <Form className="filter-form">
            <div className="search-name">
              <Field name="name" as="input" type="text" placeholder="Search by name..." />
            </div>
            <div className="filter-type">
              <label>Product types:</label>
              {productTypes.map((type: string) => (
                <div key={type}>
                  <input
                    name="types"
                    type="checkbox"
                    id={type}
                    value={type}
                    checked={values.types.includes(type)}
                    onChange={() => {
                      if (values.types.includes(type)) {
                        const nextValue = values.types.filter(value => value !== type);
                        setFieldValue("types", nextValue);
                      } else {
                        const nextValue = [...values.types, type];
                        setFieldValue("types", nextValue);
                      }
                    }}
                    onBlur={handleBlur}
                  />
                  <label htmlFor={type}>{type}</label>
                </div>
              ))}
            </div>
            <div className="filter-tags">
              <label>Product tags:</label>
              <Select 
                value={values.tags}
                placeholder="Select tags" 
                multiple 
                width="200px" 
                onChange={(value) => setFieldValue("tags", value)}
              >
                {productTags.map((tag: string) => (
                  <Select.Option key={tag} value={tag}>{tag}</Select.Option>
                ))}
              </Select>
            </div>
            <div className="sort">
              <label>Sort:</label>
              <Field name="sort" as="select">
                <option value={SortProducts.NONE}>-</option>
                <option value={SortProducts.NAME_ASC}>A-Z</option>
                <option value={SortProducts.NAME_DESC}>Z-A</option>
                <option value={SortProducts.PRICE_ASC}>Price (low to high)</option>
                <option value={SortProducts.PRICE_DESC}>Price (high to low)</option>
                <option value={SortProducts.DATE_ASC}>Creation date (from oldest)</option>
                <option value={SortProducts.DATE_DESC}>Creation date (from newest)</option>
              </Field>
            </div>
            <button type="submit">filter</button>
            <button onClick={() => dispatch({ type: "SHOW_ALL" })}>show all</button>
          </Form>
        )}
      </Formik>
    </nav>
  );
}