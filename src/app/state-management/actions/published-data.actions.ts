import { createAction, props } from "@ngrx/store";
import {
  CreatePublishedDataDto,
  PartialUpdatePublishedDataDto,
  PublishedData,
} from "@scicatproject/scicat-sdk-ts-angular";

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

export const fetchPublishedDataConfigAction = createAction(
  "[PublishedData] Fetch Published Data Config",
);
export const fetchPublishedDataConfigCompleteAction = createAction(
  "[PublishedData] Fetch Published Data Config Complete",
  props<{ publishedDataConfig: any }>(),
);
export const fetchPublishedDataConfigFailedAction = createAction(
  "[PublishedData] Fetch Published Data Config Failed",
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

export const createDataPublicationAction = createAction(
  "[PublishedData] Create Data Publication",
  props<{ data: CreatePublishedDataDto }>(),
);
export const createDataPublicationCompleteAction = createAction(
  "[PublishedData] Create Data Publication Complete",
  props<{ publishedData: PublishedData }>(),
);
export const createDataPublicationFailedAction = createAction(
  "[PublishedData] Create Data Publication Failed",
);
export const saveDataPublicationAction = createAction(
  "[PublishedData] Save Data Publication",
  props<{ data: CreatePublishedDataDto }>(),
);
export const saveDataPublicationCompleteAction = createAction(
  "[PublishedData] Save Data Publication Complete",
  props<{ publishedData: PublishedData }>(),
);
export const saveDataPublicationFailedAction = createAction(
  "[PublishedData] Save Data Publication Failed",
);
export const saveDataPublicationInLocalStorage = createAction(
  "[PublishedData] Save Data Publication In Local Storage",
  props<{ publishedData: PublishedData }>(),
);
export const clearDataPublicationFromLocalStorage = createAction(
  "[PublishedData] Clear Data Publication In Local Storage",
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
  props<{ error: string[] }>(),
);

export const amendPublishedDataAction = createAction(
  "[PublishedData] Amend Published Data",
  props<{ doi: string }>(),
);
export const amendPublishedDataCompleteAction = createAction(
  "[PublishedData] Amend Published Data Complete",
  props<{ publishedData: PublishedData }>(),
);
export const amendPublishedDataFailedAction = createAction(
  "[PublishedData] Amend Published Data Failed",
  props<{ error: string[] }>(),
);

export const deletePublishedDataAction = createAction(
  "[PublishedData] Delete Published Data",
  props<{ doi: string }>(),
);
export const deletePublishedDataCompleteAction = createAction(
  "[PublishedData] Delete Published Data Complete",
  props<{ doi: string }>(),
);
export const deletePublishedDataFailedAction = createAction(
  "[PublishedData] Delete Published Data Failed",
  props<{ error: string[] }>(),
);

export const publishPublishedDataAction = createAction(
  "[PublishedData] Publish Published Data",
  props<{ doi: string }>(),
);
export const publishPublishedDataCompleteAction = createAction(
  "[PublishedData] Publish Published Data Complete",
  props<{ publishedData: PublishedData }>(),
);
export const publishPublishedDataFailedAction = createAction(
  "[PublishedData] Publish Published Data Failed",
  props<{ error: string[] }>(),
);

export const resyncPublishedDataAction = createAction(
  "[PublishedData] Resync Published Data",
  props<{
    doi: string;
    data: PartialUpdatePublishedDataDto;
    redirect: boolean;
  }>(),
);
export const resyncPublishedDataCompleteAction = createAction(
  "[PublishedData] Resync Published Data Complete",
  props<{ publishedData: PublishedData; redirect: boolean }>(),
);
export const resyncPublishedDataFailedAction = createAction(
  "[PublishedData] Resync Published Data Failed",
);

export const updatePublishedDataAction = createAction(
  "[PublishedData] Update Published Data",
  props<{ doi: string; data: PartialUpdatePublishedDataDto }>(),
);
export const updatePublishedDataCompleteAction = createAction(
  "[PublishedData] Update Published Data Complete",
  props<{ publishedData: PublishedData }>(),
);
export const updatePublishedDataFailedAction = createAction(
  "[PublishedData] Update Published Data Failed",
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

export const storeEditingPublishedDataDoiAction = createAction(
  "[PublishedData] Store Editing Published Data DOI",
  props<{ publishedDataDoi: string }>(),
);

export const fetchRelatedDatasetsAndAddToBatchAction = createAction(
  "[PublishedData] Fetch Related Datasets And Add To Batch",
  props<{ datasetPids: string[]; publishedDataDoi: string }>(),
);

export const fetchRelatedDatasetsAndAddToBatchCompleteAction = createAction(
  "[PublishedData] Fetch Related Datasets And Add To Batch Complete",
);

export const fetchRelatedDatasetsAndAddToBatchFailedAction = createAction(
  "[PublishedData] Fetch Related Datasets And Add To Batch Failed",
);
