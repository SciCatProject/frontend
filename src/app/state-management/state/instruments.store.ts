import { Instrument, GenericFilters } from "../models";

export interface InstrumentState {
  instruments: Instrument[];
  currentInstrument: Instrument | undefined;
  totalCount: number;

  filters: GenericFilters;
}

export const initialInstrumentState: InstrumentState = {
  instruments: [],
  currentInstrument: undefined,
  totalCount: 0,

  filters: {
    sortField: "name asc",
    skip: 0,
    limit: 25,
  },
};
