import { Instrument, InstrumentFilters } from "../models";

export interface InstrumentState {
  instruments: Instrument[];
  totalCount: number;

  filters: InstrumentFilters;
}

export const initialInstrumentState: InstrumentState = {
  instruments: [],
  totalCount: 0,

  filters: {
    sortField: "name desc",
    skip: 0,
    limit: 25
  }
};
