import {ReservationTurnData} from "@core/lib/interfaces/reservation-turn-data";

export interface ReservationTableSummary {
  turn: ReservationTurnData;
  summary: Record<number, number>;
}

export type UngroupedTablesSummary = Record<number, number>;