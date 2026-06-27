export interface Slot {
  startTimeISO: string;
  endTimeISO: string;
}

export interface Availability {
  _id: string;
  dayOfWeek: number;
  startTime: number;
  endTime: number;
  slotDuration: number;
  bufferTime: number;
}

export interface AvailabilityForm {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime: number;
}