import { useRouter } from "next/router";
import Image from "next/image";
import axios from "@/app/utils/axios";
import { signUpSchema } from "@/app/utils/yup-schemas/authenticationSchemas";
import { useUsers } from "@/app/store/contexts";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { MainLayoutContainer } from "./components/main-layout";
import "@/app/css/authorization-styles.css";


const SignUp = () => {
  const { dispatch } = useUsers() || {};
  const router = useRouter();

  return (
    <MainLayoutContainer>
      <div className="decor-frame">
        <Formik 
          initialValues={{name: "", surname: "", email: "", nickname: "", password: "", cookieAccepted: false }} 
          validationSchema={signUpSchema} 
          onSubmit={(values) => {
            const { cookieAccepted, ...registerValues } = values;
            axios.post("/users/sign-up", registerValues)
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
          {() => (
            <Form className="user-form">
              <h2>Register</h2>
              <div className="form-field">
                <label>Name*:</label>
                <Field name="name" as="input" />
                <div className="error-msg">
                  <ErrorMessage name="name" />
                </div>
              </div>
              <div className="form-field">
                <label>Surname*:</label>
                <Field name="surname" as="input" />
                <div className="error-msg">
                  <ErrorMessage name="surname" />
                </div>
              </div>
              <div className="form-field">
                <label>E-mail*:</label>
                <Field name="email" as="input" />
                <div className="error-msg">
                  <ErrorMessage name="email" />
                </div>
              </div>
              <div className="form-field">
                <label>Nickname*:</label>
                <Field name="nickname" as="input" />
                <div className="error-msg">
                  <ErrorMessage name="nickname" />
                </div>
              </div>
              <div className="form-field">
                <label>Password*:</label>
                <Field name="password" as="input" type="password" />
                <div className="error-msg">
                  <ErrorMessage name="password" />
                </div>
              </div>
              <div className="form-field-checkbox">
                <label>
                  <Field name="cookieAccepted" as="input" type="checkbox"/>
                  {" "}
                  By signing up, you consent to the use of cookies.
                </label>
                <p>* - Field required.</p>
                <div className="error-msg">
                  <ErrorMessage name="cookieAccepted"/>
                </div>
              </div>
              <button type="submit">sign up</button>
            </Form>
          )}
        </Formik>
        <Image src="/images/beauty-salon-entrance.jpg" width={500} height={500} alt="Beauty Salon"/>
      </div>
    </MainLayoutContainer>
  )
}

export default SignUp;