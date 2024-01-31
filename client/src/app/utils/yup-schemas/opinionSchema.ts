import * as Yup from "yup";


export const opinionSchema = Yup.object().shape({
  name: Yup.string().default("Anonymous"),
  rate: Yup.number().min(1).max(5).required("Rate your experience!"),
  description: Yup.string().optional()
});