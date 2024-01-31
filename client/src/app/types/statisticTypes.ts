export interface GeneralStats {
  totalAppointments: number,
  avgTime: number,
  totalPrice: number,
  avgPrice: number
};

export interface CategoryStats {
  category: string,
  categoryCount: number
};

export interface IndividualStats {
  nickname: string,
  totalNumberOfAppointments: number,
  averageTime: number,
  totalPrice: number,
  averagePrice: number,
  lastAppointmentDate: string
};