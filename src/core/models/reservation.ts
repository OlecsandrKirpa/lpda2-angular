import {ReservationData, ReservationStatus} from "@core/lib/interfaces/reservation-data";
import {BaseModel} from "@core/lib/base-model";

export class Reservation extends BaseModel {
  fullname?: string;
  datetime?: Date;
  status?: ReservationStatus;
  secret?: string;
  people?: number;
  table?: string;
  notes?: string;
  email?: string;
  phone?: string;

  constructor(data: ReservationData) {
    super(data);

    this.fullname = data.fullname;
    console.log(`date`, {from: data.datetime, to: new Date(data.datetime!)});

    this.datetime = data.datetime ? new Date(data.datetime) : undefined;
    this.status = data.status;
    this.secret = data.secret;
    this.people = data.people;
    this.table = data.table;
    this.notes = data.notes;
    this.email = data.email;
    this.phone = data.phone;
  }
}