import * as Yup from "yup";


const passwordError = `Password must be 8-16 characters long and must contain at least one 
  lowercase letter, one uppercase letter, one number and a special character.`

export const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .required("Your name is required."),
  surname: Yup.string()
    .required("Your surname is required."),
  email: Yup.string()
    .email("Invalid e-mail")
    .required("Your e-mail is required"),
  nickname: Yup.string()
    .matches(/[a-zA-Z0-9]+/, "Your nickname can only contain letters and numbers.")
    .required("Your nickname is required"),
  password: Yup.string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+.<>-]).{8,16}$/, passwordError)
    .required("Password is required"),
  cookieAccepted: Yup.bool().oneOf([true], "Accept cookies to proceed")
});

export const logInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid e-mail.")
    .required("Your e-mail is required."),
  password: Yup.string()
    .required("Password is required")
});