import * as Yup from 'yup';


export const filterSchema = Yup.object().shape({
  name: Yup.string(),
  types: Yup.array()
    .of(Yup.string()),
  tags: Yup.array()
    .of(Yup.string()),
  sort: Yup.string()
});