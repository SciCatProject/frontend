import { PublishedData } from "state-management/models";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

export interface PublishedDataState extends EntityState<PublishedData> {
  // publishedData: PublishedData[];
  currentPublishedData: PublishedData;
}

export const adapter: EntityAdapter<PublishedData> = createEntityAdapter<PublishedData>({});

export const initialPublishedDataState: PublishedDataState = adapter.getInitialState({
  currentPublishedData: null
});
  /*ids: null,
    entities: null,
    publishedData: null,
    currentPublishedData: null*/

