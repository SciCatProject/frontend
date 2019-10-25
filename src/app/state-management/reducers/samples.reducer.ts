import { createReducer, Action, on } from "@ngrx/store";
import {
  SampleState,
  initialSampleState
} from "state-management/state/samples.store";
import * as fromActions from "state-management/actions/samples.actions";

const reducer = createReducer(
  initialSampleState,
  on(fromActions.fetchSamplesCompleteAction, (state, { samples }) => ({
    ...state,
    samples
  })),

  on(fromActions.fetchSamplesCountCompleteAction, (state, { count }) => ({
    ...state,
    samplesCount: count
  })),

  on(fromActions.fetchSampleCompleteAction, (state, { sample }) => ({
    ...state,
    currentSample: sample
  })),

  on(fromActions.fetchSampleDatasetsCompleteAction, (state, { datasets }) => ({
    ...state,
    datasets
  })),

  on(
    fromActions.fetchSampleDatasetsCountCompleteAction,
    (state, { count }) => ({ ...state, datasetsCount: count })
  ),

  on(fromActions.addSampleCompleteAction, (state, { sample }) => {
    const samples = state.samples;
    samples.push(sample);
    return { ...state, samples };
  }),

  on(fromActions.saveCharacteristicsCompleteAction, (state, { sample }) => ({
    ...state,
    currentSample: sample
  })),

  on(fromActions.addAttachmentCompleteAction, (state, { attachment }) => {
    const attachments = state.currentSample.attachments;
    attachments.push(attachment);
    const currentSample = { ...state.currentSample, attachments };
    return { ...state, currentSample };
  }),

  on(
    fromActions.updateAttachmentCaptionCompleteAction,
    (state, { attachment }) => {
      const attachments = state.currentSample.attachments.filter(
        existingAttachment => existingAttachment.id !== attachment.id
      );
      attachments.push(attachment);
      const currentSample = { ...state.currentSample, attachments };
      return { ...state, currentSample };
    }
  ),

  on(fromActions.removeAttachmentCompleteAction, (state, { attachmentId }) => {
    const attachments = state.currentSample.attachments.filter(
      attachment => attachment.id !== attachmentId
    );
    const currentSample = { ...state.currentSample, attachments };
    return { ...state, currentSample };
  }),

  on(fromActions.changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    const samplefilters = { ...state.samplefilters, skip, limit };
    return { ...state, samplefilters };
  }),

  on(fromActions.changeDatasetsPageAction, (state, { page, limit }) => {
    const skip = page * limit;
    const datasetFilters = { ...state.datasetFilters, skip, limit };
    return { ...state, datasetFilters };
  }),

  on(fromActions.sortByColumnAction, (state, { column, direction }) => {
    const sortField = column + (direction ? ":" + direction : "");
    const samplefilters = { ...state.samplefilters, sortField, skip: 0 };
    return { ...state, samplefilters };
  }),

  on(fromActions.setTextFilterAction, (state, { text }) => ({
    ...state,
    samplefilters: { ...state.samplefilters, text }
  }))
);

export function samplesReducer(state: SampleState | undefined, action: Action) {
  if (action.type.indexOf("[Sample]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
