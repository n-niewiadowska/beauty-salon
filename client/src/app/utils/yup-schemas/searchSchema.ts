import * as Yup from "yup";
import { SortServices } from "@/app/types/serviceTypes";


export const SearchServiceSchema = Yup.object().shape({
  name: Yup.string(),
  category: Yup.string(),
  sort: Yup.string().oneOf(Object.values(SortServices), "Invalid sort option")
});