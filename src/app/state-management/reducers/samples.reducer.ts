import { initialSampleState, SampleState } from "../state/samples.store";
import {
  FETCH_SAMPLE,
  FETCH_SAMPLE_COMPLETE,
  FETCH_SAMPLE_FAILED,
  FETCH_SAMPLES,
  FETCH_SAMPLES_COMPLETE,
  FETCH_SAMPLES_FAILED,
  FetchSampleCompleteAction,
  FetchSamplesCompleteAction,
  SELECT_SAMPLE,
  SelectSampleAction,
  ADD_SAMPLE,
  ADD_SAMPLE_COMPLETE,
  ADD_SAMPLE_FAILED,
  SAMPLE_SORT_BY_COLUMN,
  SampleSortByColumnAction,
  FETCH_SAMPLE_COUNT_COMPLETE,
  FETCH_SAMPLE_COUNT_FAILED,
  FETCH_SAMPLE_COUNT,
  CHANGE_PAGE,
  ChangePageAction,
  FetchSampleCountCompleteAction,
  SEARCH_SAMPLES,
  SearchSampleAction,
  SET_CURRENT_SAMPLE,
  SetCurrentSample,
  FETCH_DATASETS_FOR_SAMPLE,
  FETCH_DATASETS_FOR_SAMPLE_COMPLETE,
  FetchDatasetsForSampleComplete,
  SET_CURRENT_DATASETS,
  SetCurrentDatasets,
  ADD_ATTACHMENT,
  ADD_ATTACHMENT_COMPLETE,
  AddAttachmentCompleteAction,
  ADD_ATTACHMENT_FAILED,
  DELETE_ATTACHMENT_COMPLETE,
  DELETE_ATTACHMENT,
  DeleteAttachmentCompleteAction,
  DELETE_ATTACHMENT_FAILED
} from "state-management/actions/samples.actions";
import { Action } from "@ngrx/store";

export function samplesReducer(
  state: SampleState = initialSampleState,
  action: Action
): SampleState {
  if (action.type.indexOf("[Sample]") !== -1) {
    console.log("Action came in! " + action.type);
  }

  switch (action.type) {
    case SELECT_SAMPLE: {
      const selectedId = (action as SelectSampleAction).sampleId;
      return { ...state, selectedId };
    }

    case SET_CURRENT_SAMPLE: {
      const s = Object.assign({}, state, {
        currentSample: (action as SetCurrentSample).sample
      });
      return s;
    }

    case SET_CURRENT_DATASETS: {
      const s = Object.assign({}, state, {
        datasets: (action as SetCurrentDatasets).datasets
      });
      return s;
    }

    case SAMPLE_SORT_BY_COLUMN: {
      const { column, direction } = action as SampleSortByColumnAction;
      const sortField = column + (direction ? " " + direction : "");
      const filters = { ...state.filters, sortField, skip: 0 };
      return { ...state, filters, samplesLoading: true };
    }

    case ADD_SAMPLE: {
      return { ...state };
    }

    case SEARCH_SAMPLES: {
      const { query } = action as SearchSampleAction;
      const filters = { ...state.filters, text: query };
      return { ...state, filters, searchTerms: query };
    }

    case ADD_SAMPLE_COMPLETE: {
      return { ...state };
    }
    case ADD_SAMPLE_FAILED: {
      return { ...state };
    }

    case FETCH_DATASETS_FOR_SAMPLE: {
      return { ...state, datasetsLoading: true };
    }

    case FETCH_SAMPLES: {
      return { ...state, samplesLoading: true };
    }

    case FETCH_DATASETS_FOR_SAMPLE_COMPLETE: {
      const list = (action as FetchDatasetsForSampleComplete).datasets;

      const datasets = list.map(function(item) {
        return item["pid"];
      });

      return { ...state, datasets, datasetsLoading: false };
    }

    case FETCH_SAMPLES_COMPLETE: {
      const list = (action as FetchSamplesCompleteAction).samples;
      const samples = list.reduce(
        (samples2, sample) => ({
          ...samples2,
          [sample.sampleId]: sample
        }),
        {}
      );
      return { ...state, samples, samplesLoading: false };
    }

    case FETCH_SAMPLES_FAILED: {
      return { ...state, samplesLoading: false };
    }

    case FETCH_SAMPLE: {
      return { ...state, samplesLoading: true };
    }

    case FETCH_SAMPLE_COMPLETE: {
      const currentSample = (action as FetchSampleCompleteAction).currentSample;
      return { ...state, currentSample, samplesLoading: false };
    }

    case FETCH_SAMPLE_FAILED: {
      return { ...state, samplesLoading: false };
    }

    case FETCH_SAMPLE_COUNT: {
      return { ...state, samplesLoading: true };
    }

    case FETCH_SAMPLE_COUNT_COMPLETE: {
      const totalCount = (action as FetchSampleCountCompleteAction).sampleCount;
      return { ...state, totalCount, samplesLoading: false };
    }

    case FETCH_SAMPLE_COUNT_FAILED: {
      return { ...state, samplesLoading: false };
    }

    case CHANGE_PAGE: {
      const { page, limit } = action as ChangePageAction;
      const skip = page * limit;
      const filters = { ...state.filters, skip, limit };
      return {
        ...state,
        samplesLoading: true,
        filters
      };
    }

    case ADD_ATTACHMENT: {
      return { ...state, addingAttachment: true };
    }

    case ADD_ATTACHMENT_COMPLETE: {
      const attachment = (action as AddAttachmentCompleteAction).attachment;
      const attachments = state.currentSample.attachments;
      const attach2 = new Set(attachments);
      attach2.add(attachment);

      return {
        ...state,
        addingAttachment: false,
        currentSample: {
          ...state.currentSample,
          attachments: Array.from(attach2)
        }
      };
    }

    case ADD_ATTACHMENT_FAILED: {
      return { ...state };
    }

    case DELETE_ATTACHMENT: {
      return { ...state, deletingAttachment: true };
    }

    case DELETE_ATTACHMENT_COMPLETE: {
      const attachments = state.currentSample.attachments;
      const attachmentId = (action as DeleteAttachmentCompleteAction)
        .attachmentId;
      const attach2 = attachments.filter(
        attachment => attachment.id !== attachmentId
      );
      return {
        ...state,
        deletingAttachment: false,
        currentSample: { ...state.currentSample, attachments: attach2 }
      };
    }

    case DELETE_ATTACHMENT_FAILED: {
      return { ...state };
    }

    default: {
      return state;
    }
  }
}
