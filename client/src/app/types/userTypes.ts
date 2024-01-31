export interface User {
  _id: string,
  name: string,
  surname: string,
  email: string,
  nickname: string,
  password: string,
  role: string
}

export type UserAction = 
| { type: "LOGIN", payload: User } 
| { type: "REHYDRATE", payload: User }
| { type: "LOGOUT" }