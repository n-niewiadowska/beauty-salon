import { Categories } from "@/app/types/serviceTypes";
import * as Yup from "yup";


export const ServiceSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  category: Yup.string().oneOf(Object.values(Categories), "Wrong category"),
  description: Yup.string().optional(),
  price: Yup.number().min(10, "The price must be at least 10").required("Price is required"),
  lengthInMinutes: Yup.number().min(5, "Length of the service must be longer than 5 minutes")
    .max(300, "Length of the service must be shorter than 300 minutes")
    .required("Duration is required"),
  availability: Yup.bool().default(true)
});