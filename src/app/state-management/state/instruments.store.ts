import { Instrument } from "@scicatproject/scicat-sdk-ts-angular";
import { GenericFilters } from "../models";

export interface InstrumentState {
  instruments: Instrument[];
  currentInstrument: Instrument | undefined;
  currentInstruments: Instrument[];
  totalCount: number;

  filters: GenericFilters;
}

export const initialInstrumentState: InstrumentState = {
  instruments: [],
  currentInstrument: undefined,
  currentInstruments: [],
  totalCount: 0,

  filters: {
    sortField: "name asc",
    skip: 0,
    limit: 25,
  },
};
