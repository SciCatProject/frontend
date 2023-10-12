import { createAction, props } from "@ngrx/store";
import { PublishedData } from "shared/sdk";

export const fetchAllPublishedDataAction = createAction(
  "[PublishedData] Fetch All Published Data",
);
export const fetchAllPublishedDataCompleteAction = createAction(
  "[PublishedData] Fetch All Published Data Complete",
  props<{ publishedData: PublishedData[] }>(),
);
export const fetchAllPublishedDataFailedAction = createAction(
  "[PublishedData] Fetch All Published Datas Failed",
);

export const fetchCountAction = createAction("[PublishedData] Fetch Count");
export const fetchCountCompleteAction = createAction(
  "[PublishedData] Fetch Count Complete",
  props<{ count: number }>(),
);
export const fetchCountFailedAction = createAction(
  "[PublishedData] Fetch Count Failed",
);

export const fetchPublishedDataAction = createAction(
  "[PublishedData] Fetch Published Data",
  props<{ id: string }>(),
);
export const fetchPublishedDataCompleteAction = createAction(
  "[PublishedData] Fetch Published Data Complete",
  props<{ publishedData: PublishedData }>(),
);
export const fetchPublishedDataFailedAction = createAction(
  "[PublishedData] Fetch Published Data Failed",
);

export const publishDatasetAction = createAction(
  "[PublishedData] Publish Dataset",
  props<{ data: PublishedData }>(),
);
export const publishDatasetCompleteAction = createAction(
  "[PublishedData] Publish Dataset Complete",
  props<{ publishedData: PublishedData }>(),
);
export const publishDatasetFailedAction = createAction(
  "[PublishedData] Publish Dataset Failed",
);

export const registerPublishedDataAction = createAction(
  "[PublishedData] Register Published Data",
  props<{ doi: string }>(),
);
export const registerPublishedDataCompleteAction = createAction(
  "[PublishedData] Register Published Data Complete",
  props<{ publishedData: PublishedData }>(),
);
export const registerPublishedDataFailedAction = createAction(
  "[PublishedData] Register Published Data Failed",
);

export const resyncPublishedDataAction = createAction(
  "[PublishedData] Resync Published Data",
  props<{ doi: string; data: Partial<PublishedData> }>(),
);
export const resyncPublishedDataCompleteAction = createAction(
  "[PublishedData] Resync Published Data Complete",
  props<{ publishedData: PublishedData }>(),
);
export const resyncPublishedDataFailedAction = createAction(
  "[PublishedData] Resync Published Data Failed",
);

export const changePageAction = createAction(
  "[PublishedData] Change Page",
  props<{ page: number; limit: number }>(),
);

export const sortByColumnAction = createAction(
  "[PublishedData] Sort By Column",
  props<{ column: string; direction: string }>(),
);

export const clearPublishedDataStateAction = createAction(
  "[PublischedData] Clear State",
);
