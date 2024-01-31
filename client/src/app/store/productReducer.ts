import { State, ProductAction } from "@/app/types/productTypes";


export const productReducer = (state: State, action: ProductAction) => {
  switch (action.type) {
    case "ADD_PRODUCTS": {
      return { ...state, products: action.payload, filteredProducts: action.payload };
    }
    case "APPLY_FILTERS": {
      const { name, types, tags, sort } = action.payload;
      let filtered = state.products;

      if (name) {
        filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(name.toLowerCase())
      )}

      if (types.length > 0) {
        filtered = filtered.filter(product =>
        types.some(type => product.product_type === type)
      )}

      if (tags.length > 0) {
        filtered = filtered.filter(product =>
        tags.some(tag => product.tag_list.includes(tag))
      );
      }

      if (sort) {
        filtered = [...filtered].sort((a, b) => {
          switch (action.payload.sort) {
            case "name_asc":
              return a.name.localeCompare(b.name);
            case "name_desc":
              return b.name.localeCompare(a.name);
            case "price_asc":
              return Number(a.price) - Number(b.price);
            case "price_desc":
              return Number(b.price) - Number(a.price);
            case "date_asc":
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case "date_desc":
              return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            default:
              return 0;
          }
        });
      }

      return {
        ...state,
        filteredProducts: filtered
      };
    }
    case "SHOW_ALL": {
      return {
        ...state,
        filteredProducts: state.products
      }
    }
    default: {
      return state;
    }
  }
}