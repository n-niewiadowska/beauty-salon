import { User, UserAction } from "../types/userTypes";


export const userReducer = (state: User | null, action: UserAction) => {
  switch (action.type) {
    case "LOGIN": {
      console.log(action.payload)
      return action.payload;
    }
    case "REHYDRATE": {
      return action.payload;
    }
    case "LOGOUT": {
      return null;
    }
    default: {
      return state;
    }
  }
}