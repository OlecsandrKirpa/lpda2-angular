export interface CreateReservationData {
  datetime: string;
  adults: number;
  children: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  notes: string | null;
}

export function formatReservationData(data: {
  datetime: unknown;
  adults: unknown;
  children: unknown;
  email: unknown;
  phone: unknown;
  notes: unknown;
  firstName: unknown;
  lastName: unknown;
}): CreateReservationData | null {
  const invalid = (fieldName: string, value: unknown) => {
    console.warn(`Invalid field ${fieldName}`, value);
    return null;
  };

  if (!(typeof data.email === "string" && data.email.length > 0)) return invalid(`email`, data.email);
  if (!(typeof data.phone === "string" && data.phone.length > 0)) return invalid(`phone`, data.phone);
  if (!(typeof data.firstName === "string" && data.firstName.length > 0)) return invalid(`firstName`, data.firstName);
  if (!(typeof data.lastName === "string" && data.lastName.length > 0)) return invalid(`lastName`, data.lastName);
  if (!(typeof data.datetime === "string" && data.datetime.length > 0)) return invalid(`datetime`, data.datetime);
  if (!(data.notes === null || (typeof data.notes === "string" && data.notes.length > 0))) return invalid(`notes`, data.notes);

  if (!(typeof data.children === "number" && data.children >= 0)) return invalid(`children`, data.children);
  if (!(typeof data.adults === "number" && data.adults > 0)) return invalid(`adults`, data.adults);

  return {
    email: data.email,
    phone: data.phone,
    datetime: data.datetime,
    children: data.children,
    notes: data.notes,
    adults: data.adults,
    first_name: data.firstName,
    last_name: data.lastName
  }
}