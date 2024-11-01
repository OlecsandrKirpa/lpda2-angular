import {ReservationData} from "@core/lib/interfaces/reservation-data";
import {Setting, SettingKey, SettingValue} from "@core/lib/settings";
import {PublicMessages} from "@core/components/public-message/public-message.component";

/**
 * Data preloaded on public pages that is essential to make the public part of the app work.
 */
export interface PublicData {
  /**
   * If user has created a reservation with the same browser he's been navigating now, he will be able to see the reservation every time he navigates to the public pages.
   * Server will set a cookie (http only) with the reservation secret.
   * When asking server for public data, it will check for this cookie and return the reservation data if it exists and its not passed.
   */
  reservation: ReservationData | null;

  settings: Record<SettingKey, SettingValue>;

  public_messages: PublicMessages;

  contacts: Record<string, string>;
}