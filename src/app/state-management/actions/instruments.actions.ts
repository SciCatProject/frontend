import { createAction, props } from "@ngrx/store";
import { Instrument } from "shared/sdk";

export const fetchInstrumentsAction = createAction(
  "[Instrument] Fetch Instruments"
);
export const fetchInstrumentsCompleteAction = createAction(
  "[Instrument] Fetch Instruments Complete",
  props<{ instruments: Instrument[] }>()
);
export const fetchInstrumentsFailedAction = createAction(
  "[Instrument] Fetch Instruments Failed"
);

export const fetchCountAction = createAction("[Instrument] Fetch Count");
export const fetchCountCompleteAction = createAction(
  "[Instrument] Fetch Count Complete",
  props<{ count: number }>()
);
export const fetchCountFailedAction = createAction(
  "[Instrument] Fetch Count Failed"
);
