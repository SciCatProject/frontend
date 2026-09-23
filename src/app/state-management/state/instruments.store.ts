import { Instrument } from "@scicatproject/scicat-sdk-ts-angular";
import { GenericFilters } from "../models";

export interface InstrumentState {
  instruments: Instrument[];
  currentInstrument: Instrument | undefined;
  totalCount: number;
  instrumentsCountIsLoading: boolean;

  filters: GenericFilters;
}

export const initialInstrumentState: InstrumentState = {
  instruments: [],
  currentInstrument: undefined,
  totalCount: 0,
  instrumentsCountIsLoading: false,

  filters: {
    sortField: "name asc",
    skip: 0,
    limit: 25,
  },
};
