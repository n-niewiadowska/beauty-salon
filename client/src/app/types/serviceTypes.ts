export enum Categories {
  FACIAL = "Facial treatments",
  MANI_PEDI = "Manicure and pedicure",
  MASSAGE = "Massage",
  HAIR = "Hair removal",
  MAKEUP = "Make up"
}

export enum SortServices {
  NONE = "",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc"
}

export interface Service {
  _id: string,
  name: string,
  category: Categories,
  description: string,
  price: number,
  lengthInMinutes: number,
  availability: boolean
}