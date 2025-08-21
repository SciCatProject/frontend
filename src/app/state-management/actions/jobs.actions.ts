import { createAction, props } from "@ngrx/store";
import {
  CreateJobDtoV3,
  OutputJobV3Dto,
} from "@scicatproject/scicat-sdk-ts-angular";

export const fetchJobsAction = createAction("[Job] Fetch Jobs");
export const fetchJobsCompleteAction = createAction(
  "[Job] Fetch Jobs Complete",
  props<{ jobs: OutputJobV3Dto[] }>(),
);
export const fetchJobsFailedAction = createAction("[Job] Fetch Jobs Failed");

export const fetchCountAction = createAction("[Job] Fetch Count");
export const fetchCountCompleteAction = createAction(
  "[Job] Fetch Count Complete",
  props<{ count: number }>(),
);
export const fetchCountFailedAction = createAction("[Job] Fetch Count Failed");

export const fetchJobAction = createAction(
  "[Job] Fetch Job",
  props<{ jobId: string }>(),
);
export const fetchJobCompleteAction = createAction(
  "[Job] Fetch Job Complete",
  props<{ job: OutputJobV3Dto }>(),
);
export const fetchJobFailedAction = createAction("[Job] Fetch Job Failed");

export const submitJobAction = createAction(
  "[Job] Submit Job",
  props<{ job: CreateJobDtoV3 }>(),
);
export const submitJobCompleteAction = createAction(
  "[Job] Submit Job Complete",
  props<{ job: OutputJobV3Dto }>(),
);
export const submitJobFailedAction = createAction(
  "[Job] Submit Job Failed",
  props<{ err: Error }>(),
);

export const setJobViewModeAction = createAction(
  "[Job] Set Mode Filter",
  props<{ mode: Record<string, string> | undefined }>(),
);

export const setJobsLimitFilterAction = createAction(
  "[Job] Set Limit Filter",
  props<{ limit: number }>(),
);

export const changePageAction = createAction(
  "[Job] Change Page",
  props<{ page: number; limit: number }>(),
);

export const sortByColumnAction = createAction(
  "[Job] Sort By Column",
  props<{ column: string; direction: string }>(),
);

export const clearJobsStateAction = createAction("[Job] Clear State");
