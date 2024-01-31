export enum AppointmentStates {
  BOOKED = "Booked",
  CONFIRMED = "Confirmed",
  ACCEPTED = "Accepted"
}

export interface UserAppointment {
  _id: string,
  date: string,
  state: AppointmentStates,
  serviceName: string,
  duration: number,
  price: number
}

export interface GeneralAppointment {
  _id: string,
  date: string,
  state: AppointmentStates,
  serviceName: string,
  userName: string,
  userSurname: string,
  duration: number,
  price: number
}