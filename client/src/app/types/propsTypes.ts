import { ReactNode, Dispatch, SetStateAction } from "react";
import { Opinion } from "./opinionTypes";
import { Service } from "./serviceTypes";
import { UserAppointment } from "./appointmentTypes";
import { User } from "./userTypes";


export type ComponentProps = {
  children: ReactNode;
}

// Opinions

export type StarRatingProps = {
  rating: number;
};

export type OpinionListProps = {
  opinions: Opinion[];
  rating: number
}

// Services

export type SearchServicesProps = {
  setServices: Dispatch<SetStateAction<Service[]>>;
}

export type ServiceListProps = {
  services: Service[];
}

export type AdminServiceListProps = {
  services: Service[],
  setServices: Dispatch<SetStateAction<Service[]>>
}

export type ServiceDetailsProps = {
  service: Service;
}

// Appointments

export type AppointmentsListProps = {
  appointments: UserAppointment[],
  setAppointments: Dispatch<SetStateAction<UserAppointment[]>>
}

export type BookingProps = {
  date: Date | null,
  action: string,
  onSubmit: (values: { category: string, service: string }) => void
}

export type DatePickerProps = {
  date: Date | null,
  select: Dispatch<SetStateAction<Date | null>>
}

// statistics

export type IndividualStatsProps = {
  user: User,
  setShowStats: Dispatch<SetStateAction<boolean>>
};

export type SearchUsersProps = {
  setActiveUser: Dispatch<SetStateAction<User | null>>,
  setShowStats: Dispatch<SetStateAction<boolean>>
}