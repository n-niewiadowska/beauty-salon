import { useRouter } from "next/router";
import Image from "next/image";
import axios from "@/app/utils/axios";
import { logInSchema } from "@/app/utils/yup-schemas/authenticationSchemas";
import { useUsers } from "@/app/store/contexts";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { MainLayoutContainer } from "./components/main-layout";
import "@/app/css/authorization-styles.css";


const LogIn = () => {
  const { user, dispatch } = useUsers() || {};
  const router = useRouter();

  return (
    <MainLayoutContainer>
      <div className="decor-frame">
        <div className="user">
          <Formik 
            initialValues={{ email: "", password: "" }} 
            validationSchema={logInSchema} 
            onSubmit={(values) => {
              axios.post("/users/login", values)
                .then(response => {
                  localStorage.setItem("user", JSON.stringify(response.data.user));
                  if (dispatch) {
                    dispatch({ type: "LOGIN", payload: response.data.user });

                    if (response.data.user.role === "admin") {
                      router.push("/admin");
                    } else {
                      router.push("/user");
                    }
                  }
                })
                .catch(error => {
                  if (error.response) {
                    alert(error.response.data);
                  }
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form className="user-form">
                <h2>Log in</h2>
                <div className="form-field">
                  <label>E-mail*:</label>
                  <Field name="email" as="input" />
                  <div className="error-msg">
                  <ErrorMessage name="email" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Password*:</label>
                  <Field name="password" as="input" type="password" />
                  <div className="error-msg">
                    <ErrorMessage name="password" />
                  </div>
                </div>
                <div className="form-field">
                  <p>* - Field required.</p>
                </div>
                <button type="submit" disabled={isSubmitting}>log in</button>
              </Form>
            )}
          </Formik>
        </div>
        <Image src="/images/beauty-salon-entrance.jpg" width={500} height={500} alt="Beauty Salon" priority/>
      </div>
    </MainLayoutContainer>
  )
}

export default LogIn;