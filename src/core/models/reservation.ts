import {ReservationData, ReservationStatus} from "@core/lib/interfaces/reservation-data";
import {BaseModel} from "@core/lib/base-model";
import {DeliveredEmail} from "@core/models/delivered-email";
import {DeliveredEmailData} from "@core/lib/interfaces/delivered-email-data";

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

  delivered_emails?: DeliveredEmail[];

  constructor(data: ReservationData) {
    super(data);

    this.fullname = data.fullname;
    this.datetime = data.datetime ? new Date(data.datetime) : undefined;
    this.status = data.status;
    this.secret = data.secret;
    this.people = data.people;
    this.table = data.table;
    this.notes = data.notes;
    this.email = data.email;
    this.phone = data.phone;

    this.delivered_emails = data.delivered_emails ? data.delivered_emails.map((data: DeliveredEmailData) => new DeliveredEmail(data)) : [];
  }
}