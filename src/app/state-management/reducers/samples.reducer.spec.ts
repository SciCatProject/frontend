import { samplesReducer } from "./samples.reducer";
import { initialSampleState } from "../state/samples.store";
import {
  SelectSampleAction,
  AddAttachmentAction,
  DeleteAttachmentAction,
  FetchDatasetsForSampleFailed,
  SetCurrentSample,
  SetCurrentDatasets,
  SampleSortByColumnAction,
  AddSampleAction,
  SearchSampleAction,
  AddSampleCompleteAction,
  AddSampleFailedAction,
  FetchDatasetsForSample,
  FetchSamplesAction,
  FetchDatasetsForSampleComplete,
  FetchSamplesCompleteAction,
  FetchSamplesFailedAction,
  FetchSampleAction,
  FetchSampleCompleteAction,
  FetchSampleFailedAction,
  FetchSampleCountAction,
  FetchSampleCountCompleteAction,
  FetchSampleCountFailedAction,
  ChangePageAction,
  AddAttachmentCompleteAction,
  AddAttachmentFailedAction,
  DeleteAttachmentCompleteAction,
  DeleteAttachmentFailedAction,
  UpdateAttachmentCaptionCompleteAction,
  UpdateAttachmentCaptionFailedAction
} from "../actions/samples.actions";
import { Attachment, Sample, Dataset } from "../models";

describe("SamplesReducer", () => {
  describe("default", () => {
    it("should return the initial state", () => {
      const noopAction = new FetchDatasetsForSampleFailed();
      const state = samplesReducer(undefined, noopAction);

      expect(state).toEqual(initialSampleState);
    });
  });

  describe("SELECT_SAMPLE", () => {
    it("should set selectedId", () => {
      const id = "my sample id";
      const action = new SelectSampleAction(id);
      const state = samplesReducer(initialSampleState, action);

      expect(state.selectedId).toEqual(id);
    });
  });

  describe("SET_CURRENT_SAMPLE", () => {
    it("should set currentSample", () => {
      const sample = new Sample();
      const action = new SetCurrentSample(sample);
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample).toEqual(sample);
    });
  });

  describe("SET_CURRENT_DATASETS", () => {
    it("should set datasets", () => {
      const datasets = [new Dataset()];
      const datasetPids = datasets.map(dataset => dataset.pid);
      const action = new SetCurrentDatasets(datasets);
      const state = samplesReducer(initialSampleState, action);

      expect(state.datasets).toEqual(datasetPids);
    });
  });

  describe("SAMPLE_SORT_BY_COLUMN", () => {
    it("should set filters and set samplesLoading to true", () => {
      const column = "owner";
      const direction = "desc";
      const action = new SampleSortByColumnAction(column, direction);
      const state = samplesReducer(initialSampleState, action);

      expect(state.filters.sortField).toEqual(column + " " + direction);
      expect(state.filters.skip).toEqual(0);
      expect(state.samplesLoading).toBe(true);
    });
  });

  describe("ADD_SAMPLE", () => {
    it("should return the initial state", () => {
      const sample = new Sample();
      const action = new AddSampleAction(sample);
      const state = samplesReducer(initialSampleState, action);

      expect(state).toEqual(initialSampleState);
    });
  });

  describe("SEARCH_SAMPLES", () => {
    it("should set filters and searchTerms", () => {
      const query = "test";
      const action = new SearchSampleAction(query);
      const state = samplesReducer(initialSampleState, action);

      expect(state.filters.text).toEqual(query);
      expect(state.searchTerms).toEqual(query);
    });
  });

  describe("ADD_SAMPLE_COMPLETE", () => {
    it("should return the initial state", () => {
      const sample = new Sample();
      const action = new AddSampleCompleteAction(sample);
      const state = samplesReducer(initialSampleState, action);

      expect(state).toEqual(initialSampleState);
    });
  });

  describe("ADD_SAMPLE_FAILED", () => {
    it("should return the initial state", () => {
      const sample = new Sample();
      const action = new AddSampleFailedAction(sample);
      const state = samplesReducer(initialSampleState, action);

      expect(state).toEqual(initialSampleState);
    });
  });

  describe("FETCH_DATASETS_FOR_SAMPLE", () => {
    it("should set datasetsLoading to true", () => {
      const sampleId = "ABC123";
      const action = new FetchDatasetsForSample(sampleId);
      const state = samplesReducer(initialSampleState, action);

      expect(state.datasetsLoading).toBe(true);
    });
  });

  describe("FETCH_SAMPLES", () => {
    it("should set samplesLoading to true", () => {
      const action = new FetchSamplesAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplesLoading).toBe(true);
    });
  });

  describe("FETCH_DATASETS_FOR_SAMPLE_COMPLETE", () => {
    it("should set datasets and set datasetsLoading to false", () => {
      const datasets = [new Dataset()];
      const action = new FetchDatasetsForSampleComplete(datasets);
      const state = samplesReducer(initialSampleState, action);

      expect(state.datasetsLoading).toBe(false);
    });
  });

  describe("FETCH_SAMPLES_COMPLETE", () => {
    it("should set samples and set samplesLoading to false", () => {
      const samples = [new Sample()];
      const action = new FetchSamplesCompleteAction(samples);
      const state = samplesReducer(initialSampleState, action);

      expect(state.samples).toEqual({ [samples[0].sampleId]: samples[0] });
    });
  });

  describe("FETCH_SAMPLES_FAILED", () => {
    it("should set samplesLoading to false", () => {
      const action = new FetchSamplesFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplesLoading).toBe(false);
    });
  });

  describe("FETCH_SAMPLE", () => {
    it("should set samplesLoading to true", () => {
      const sampleId = "ABC123";
      const action = new FetchSampleAction(sampleId);
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplesLoading).toBe(true);
    });
  });

  describe("FETCH_SAMPLE_COMPLETE", () => {
    it("should set currentSample and set samplesLoading to false", () => {
      const sample = new Sample();
      const action = new FetchSampleCompleteAction(sample);
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample).toEqual(sample);
      expect(state.samplesLoading).toBe(false);
    });
  });

  describe("FETCH_SAMPLE_FAILED", () => {
    it("should set samplesLoading to false", () => {
      const action = new FetchSampleFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplesLoading).toBe(false);
    });
  });

  describe("FETCH_SAMPLE_COUNT", () => {
    it("should set samplesLoading to true", () => {
      const count = 10;
      const action = new FetchSampleCountAction(count);
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplesLoading).toBe(true);
    });
  });

  describe("FETCH_SAMPLE_COUNT_COMPLETE", () => {
    it("should set totalCount and set samplesLoading to false", () => {
      const count = 10;
      const action = new FetchSampleCountCompleteAction(count);
      const state = samplesReducer(initialSampleState, action);

      expect(state.totalCount).toEqual(count);
      expect(state.samplesLoading).toBe(false);
    });
  });

  describe("FETCH_SAMPLE_COUNT_FAILED", () => {
    it("should set samplesLoading to false", () => {
      const action = new FetchSampleCountFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplesLoading).toBe(false);
    });
  });

  describe("CHANGE_PAGE", () => {
    it("should set filters and set samplesLoading to true", () => {
      const page = 2;
      const limit = 25;
      const action = new ChangePageAction(page, limit);
      const state = samplesReducer(initialSampleState, action);

      expect(state.filters.limit).toEqual(limit);
      expect(state.filters.skip).toEqual(page * limit);
      expect(state.samplesLoading).toBe(true);
    });
  });

  describe("ADD_ATTACHMENT", () => {
    it("should set addingAttachment to true", () => {
      const attachment = new Attachment();
      const action = new AddAttachmentAction(attachment);
      const state = samplesReducer(initialSampleState, action);
      expect(state.addingAttachment).toEqual(true);
    });
  });

  describe("ADD_ATTACHMENT_COMPLETE", () => {
    it("should set attachments for currentSample and set addingAttachment to false", () => {
      const sample = new Sample();
      const sampleAction = new SetCurrentSample(sample);
      const intermediateState = samplesReducer(
        initialSampleState,
        sampleAction
      );
      const attachment = new Attachment();
      const attachmentAction = new AddAttachmentCompleteAction(attachment);
      const state = samplesReducer(intermediateState, attachmentAction);

      expect(state.currentSample.attachments).toContain(attachment);
    });
  });

  describe("ADD_ATTACHMENT_FAILED", () => {
    it("should return the initial state", () => {
      const error = new Error();
      const action = new AddAttachmentFailedAction(error);
      const state = samplesReducer(initialSampleState, action);

      expect(state).toEqual(initialSampleState);
    });
  });

  describe("DELETE_ATTACHMENT", () => {
    it("should set deletingAttachment to true", () => {
      const sampleId = "123abc";
      const attachmentId = "abc123";
      const action = new DeleteAttachmentAction(sampleId, attachmentId);
      const state = samplesReducer(initialSampleState, action);
      expect(state.deletingAttachment).toEqual(true);
    });
  });

  describe("DELETE_ATTACHMENT_COMPLETE", () => {
    it("should set attachments for currentSample and set deletingAttachment to false", () => {
      const sample = new Sample();
      const sampleAction = new SetCurrentSample(sample);
      const firstIntermediateState = samplesReducer(
        initialSampleState,
        sampleAction
      );
      const attachment = new Attachment();
      const addAttachmentAction = new AddAttachmentCompleteAction(attachment);
      const secondIntermediateState = samplesReducer(
        firstIntermediateState,
        addAttachmentAction
      );

      expect(secondIntermediateState.currentSample.attachments).toContain(
        attachment
      );

      const deleteAttachmentAction = new DeleteAttachmentCompleteAction(
        attachment.id
      );
      const state = samplesReducer(
        secondIntermediateState,
        deleteAttachmentAction
      );

      expect(state.currentSample.attachments).toEqual([]);
    });
  });

  describe("DELETE_ATTACHMENT_FAILED", () => {
    it("should return the initial state", () => {
      const error = new Error();
      const action = new DeleteAttachmentFailedAction(error);
      const state = samplesReducer(initialSampleState, action);

      expect(state).toEqual(initialSampleState);
    });
  });

  describe("UPDATE_ATTACHMENT_CAPTION_COMPLETE", () => {
    it("should set attachments for currentSample", () => {
      const sample = new Sample();
      const sampleAction = new SetCurrentSample(sample);
      const firstIntermediateState = samplesReducer(
        initialSampleState,
        sampleAction
      );
      const attachment = new Attachment();
      const addAttachmentAction = new AddAttachmentCompleteAction(attachment);
      const secondIntermediateState = samplesReducer(
        firstIntermediateState,
        addAttachmentAction
      );

      expect(secondIntermediateState.currentSample.attachments).toContain(
        attachment
      );

      const updateAttachmentAction = new UpdateAttachmentCaptionCompleteAction(
        attachment
      );
      const state = samplesReducer(
        secondIntermediateState,
        updateAttachmentAction
      );

      expect(state.currentSample.attachments).toContain(attachment);
    });
  });

  describe("UPDATE_ATTACHMENT_CAPTION_FAILED", () => {
    it("should return the initial state", () => {
      const error = new Error();
      const action = new UpdateAttachmentCaptionFailedAction(error);
      const state = samplesReducer(initialSampleState, action);

      expect(state).toEqual(initialSampleState);
    });
  });
});
