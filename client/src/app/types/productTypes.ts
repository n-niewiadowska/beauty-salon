export interface Product {
  id: number,
  brand: string,
  name: string,
  price: string,
  price_sign: string,
  image: string,
  description: string,
  product_type: string,
  tag_list: string[],
  created_at: string
}

export const productTags = ["Canadian", "CertClean", "Chemical Free", "Dairy Free", "EWG certified", 
  "EcoCert", "FairTrade", "Gluten Free", "Hypoallergenic", "Natural", "No Talc", "Non-GMO", "Organic", 
  "Peanut Free Product", "Sugar Free", "USDA Organic", "Vegan", "alcohol free", "cruelty free", "oil free", 
  "purpicks", "silicone free", "water free"];

export const productTypes = ["blush", "bronzer", "eyebrow", "eyeliner", "eyeshadow", "foundation",
  "lip liner", "lipstick", "mascara", "nail polish"];

export enum SortProducts {
  NONE = "",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
  DATE_ASC = "date_asc",
  DATE_DESC = "date_desc"
}

export type State = {
  products: Product[];
  filteredProducts: Product[];
}

export type ProductAction = 
| { type: "ADD_PRODUCTS", payload: Product[] }
| { type: "APPLY_FILTERS", payload: { name: string, types: string[], tags: string[], sort: string }}
| { type: "SHOW_ALL" }