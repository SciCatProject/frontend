import { createAction, props } from "@ngrx/store";
import { Instrument } from "@scicatproject/scicat-sdk-ts-angular";

export const fetchInstrumentsAction = createAction(
  "[Instrument] Fetch Instruments",
);
export const fetchInstrumentsCompleteAction = createAction(
  "[Instrument] Fetch Instruments Complete",
  props<{ instruments: Instrument[] }>(),
);
export const fetchInstrumentsFailedAction = createAction(
  "[Instrument] Fetch Instruments Failed",
);

export const fetchCountAction = createAction("[Instrument] Fetch Count");
export const fetchCountCompleteAction = createAction(
  "[Instrument] Fetch Count Complete",
  props<{ count: number }>(),
);
export const fetchCountFailedAction = createAction(
  "[Instrument] Fetch Count Failed",
);

export const fetchInstrumentAction = createAction(
  "[Instrument] Fetch Instrument",
  props<{ pid: string }>(),
);
export const fetchInstrumentCompleteAction = createAction(
  "[Instrument] Fetch Instrument Complete",
  props<{ instrument: Instrument }>(),
);
export const fetchInstrumentFailedAction = createAction(
  "[Instrument] Fetch Instrument Failed",
);

export const saveCustomMetadataAction = createAction(
  "[Instrument] Save Custom Metadata",
  props<{ pid: string; customMetadata: Record<string, unknown> }>(),
);
export const saveCustomMetadataCompleteAction = createAction(
  "[Instrument] Save Custom Metadata Complete",
  props<{ instrument: Instrument }>(),
);
export const saveCustomMetadataFailedAction = createAction(
  "[Instrument] Save Custom Metadata Failed",
);

export const changePageAction = createAction(
  "[Instrument] Change Page",
  props<{ page: number; limit: number }>(),
);

export const sortByColumnAction = createAction(
  "[Instrument] Sort By Column",
  props<{ column: string; direction: string }>(),
);

export const clearInstrumentsStateAction = createAction(
  "[Instrument] Clear State",
);
