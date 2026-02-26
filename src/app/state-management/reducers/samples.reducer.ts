import { createReducer, Action, on } from "@ngrx/store";
import {
  SampleState,
  initialSampleState,
} from "state-management/state/samples.store";
import * as fromActions from "state-management/actions/samples.actions";

const reducer = createReducer(
  initialSampleState,
  on(
    fromActions.fetchSamplesCompleteAction,
    (state, { samples }): SampleState => ({
      ...state,
      samples,
    }),
  ),

  on(
    fromActions.fetchSampleAttachmentsCompleteAction,
    (state, { attachments }): SampleState => ({
      ...state,
      attachments,
    }),
  ),

  on(
    fromActions.fetchSamplesCountCompleteAction,
    (state, { count }): SampleState => ({
      ...state,
      samplesCount: count,
    }),
  ),

  on(
    fromActions.fetchMetadataKeysCompleteAction,
    (state, { metadataKeys }): SampleState => ({ ...state, metadataKeys }),
  ),

  on(
    fromActions.fetchSampleCompleteAction,
    (state, { sample }): SampleState => ({
      ...state,
      currentSample: sample,
    }),
  ),

  on(
    fromActions.fetchSampleDatasetsCompleteAction,
    (state, { datasets }): SampleState => ({
      ...state,
      datasets,
    }),
  ),

  on(
    fromActions.fetchSampleDatasetsCountCompleteAction,
    (state, { count }): SampleState => ({ ...state, datasetsCount: count }),
  ),

  on(fromActions.addSampleCompleteAction, (state, { sample }): SampleState => {
    const samples = state.samples;
    samples.push(sample);
    return { ...state, samples };
  }),

  on(
    fromActions.saveCharacteristicsCompleteAction,
    (state, { sample }): SampleState => ({
      ...state,
      currentSample: sample,
    }),
  ),

  on(
    fromActions.addAttachmentCompleteAction,
    (state, { attachment }): SampleState => {
      if (state.currentSample) {
        const attachments = state.attachments.filter(
          (existingAttachment) => existingAttachment.id !== attachment.id,
        );
        attachments.push(attachment);
        return { ...state, attachments };
      }
      return { ...state };
    },
  ),

  on(
    fromActions.updateAttachmentCaptionCompleteAction,
    (state, { attachment }): SampleState => {
      if (state.currentSample) {
        const attachments = state.attachments.filter(
          (existingAttachment) => existingAttachment.id !== attachment.id,
        );
        attachments.push(attachment);
        return { ...state, attachments };
      }
      return { ...state };
    },
  ),

  on(
    fromActions.removeAttachmentCompleteAction,
    (state, { attachmentId }): SampleState => {
      if (state.currentSample) {
        const attachments = state.attachments.filter(
          (attachment) => attachment.id !== attachmentId,
        );
        return { ...state, attachments };
      }
      return { ...state };
    },
  ),

  on(fromActions.changePageAction, (state, { page, limit }): SampleState => {
    const skip = page * limit;
    const sampleFilters = { ...state.sampleFilters, skip, limit };
    return { ...state, sampleFilters };
  }),

  on(
    fromActions.changeDatasetsPageAction,
    (state, { page, limit }): SampleState => {
      const skip = page * limit;
      const datasetFilters = { ...state.datasetFilters, skip, limit };
      return { ...state, datasetFilters };
    },
  ),

  on(
    fromActions.sortByColumnAction,
    (state, { column, direction }): SampleState => {
      const sortField = column + (direction ? ":" + direction : "");
      const sampleFilters = { ...state.sampleFilters, sortField, skip: 0 };
      return { ...state, sampleFilters };
    },
  ),

  on(fromActions.prefillFiltersAction, (state, { values }): SampleState => {
    const sampleFilters = { ...state.sampleFilters, ...values };
    return { ...state, sampleFilters, hasPrefilledFilters: true };
  }),

  on(
    fromActions.setTextFilterAction,
    (state, { text }): SampleState => ({
      ...state,
      sampleFilters: { ...state.sampleFilters, text },
    }),
  ),

  on(
    fromActions.addCharacteristicsFilterAction,
    (state, { characteristic }): SampleState => {
      const currentFilters = state.sampleFilters;
      const currentCharacteristics = currentFilters.characteristics;
      const sampleFilters = {
        ...currentFilters,
        characteristics: [...currentCharacteristics, characteristic],
      };
      return { ...state, sampleFilters };
    },
  ),

  on(
    fromActions.removeCharacteristicsFilterAction,
    (state, { index }): SampleState => {
      const currentFilters = state.sampleFilters;
      const characteristics = [...currentFilters.characteristics];
      characteristics.splice(index, 1);
      const sampleFilters = { ...currentFilters, characteristics };
      return { ...state, sampleFilters };
    },
  ),

  on(fromActions.clearSamplesStateAction, () => ({ ...initialSampleState })),

  on(fromActions.clearCurrentSampleStateAction, (state) => ({
    ...state,
    currentSample: undefined,
  })),
);

export const samplesReducer = (
  state: SampleState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[Sample]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
