import { samplesReducer } from "./samples.reducer";
import { SampleState } from "../state/samples.store";
import * as fromActions from "../actions/samples.actions";
import { Attachment, Sample, Dataset } from "../models";
import { SampleInterface } from "shared/sdk";

const data: SampleInterface = {
  sampleId: "testId",
  ownerGroup: "testGroup",
  attachments: []
};
const sample = new Sample(data);

const initialSampleState: SampleState = {
  samples: [],
  currentSample: sample,
  datasets: [],

  samplesCount: 0,
  datasetsCount: 0,

  samplefilters: {
    text: "",
    sortField: "creationTime:desc",
    skip: 0,
    limit: 25
  },
  datasetFilters: {
    text: "",
    sortField: "createdAt:desc",
    skip: 0,
    limit: 25
  }
};

describe("SamplesReducer", () => {
  describe("on fetchSamplesCompleteAction", () => {
    it("should set samples", () => {
      const samples = [sample];
      const action = fromActions.fetchSamplesCompleteAction({ samples });
      const state = samplesReducer(initialSampleState, action);

      expect(state.samples).toEqual(samples);
    });
  });

  describe("on fetchSamplesCountCompleteAction", () => {
    it("should set totalCount", () => {
      const count = 100;
      const action = fromActions.fetchSamplesCountCompleteAction({ count });
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplesCount).toEqual(count);
    });
  });

  describe("on fetchSampleCompleteAction", () => {
    it("should set currentSample", () => {
      const action = fromActions.fetchSampleCompleteAction({ sample });
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample).toEqual(sample);
    });
  });

  describe("on fetchSampleDatasetsCompleteAction", () => {
    it("should set datasets", () => {
      const datasets = [new Dataset()];
      const action = fromActions.fetchSampleDatasetsCompleteAction({
        datasets
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.datasets).toEqual(datasets);
    });
  });

  describe("on fetchSampleDatasetsCountCompleteAction", () => {
    it("should set datasetsCount", () => {
      const count = 100;
      const action = fromActions.fetchSampleDatasetsCountCompleteAction({
        count
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.datasetsCount).toEqual(count);
    });
  });

  describe("on addSampleCompleteAction", () => {
    it("should add the new sample to samples", () => {
      const action = fromActions.addSampleCompleteAction({ sample });
      const state = samplesReducer(initialSampleState, action);

      expect(state.samples).toEqual([sample]);
    });
  });

  describe("on saveCharacteristicsCompleteAction", () => {
    it("should set currentSample", () => {
      const action = fromActions.saveCharacteristicsCompleteAction({ sample });
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample).toEqual(sample);
    });
  });

  describe("on addAttachmentCompleteAction", () => {
    it("should set attachments for currentSample", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentCompleteAction({
        attachment
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample.attachments).toContain(attachment);
    });
  });

  describe("on updateAttachmentCaptionCompleteAction", () => {
    it("should set attachments for currentSample", () => {
      const attachment = new Attachment();
      const action = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample.attachments).toContain(attachment);
    });
  });

  describe("on removeAttachmentCompleteAction", () => {
    it("should set attachments for currentSample", () => {
      const attachment = new Attachment();
      const attachmentId = "testId";
      attachment.id = attachmentId;
      initialSampleState.currentSample.attachments = [attachment];

      const action = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample.attachments).toEqual([]);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit sampleFilters", () => {
      const page = 2;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changePageAction({ page, limit });
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplefilters.limit).toEqual(limit);
      expect(state.samplefilters.skip).toEqual(skip);
    });
  });

  describe("on changeDatasetsPageAction", () => {
    it("should set skip and limit datasetFilters", () => {
      const page = 2;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changeDatasetsPageAction({ page, limit });
      const state = samplesReducer(initialSampleState, action);

      expect(state.datasetFilters.limit).toEqual(limit);
      expect(state.datasetFilters.skip).toEqual(skip);
    });
  });

  describe("on sortByColumnAction", () => {
    it("should set sortField sample filter and set skip to 0", () => {
      const column = "test";
      const direction = "asc";
      const sortField = column + (direction ? ":" + direction : "");
      const action = fromActions.sortByColumnAction({ column, direction });
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplefilters.sortField).toEqual(sortField);
      expect(state.samplefilters.skip).toEqual(0);
    });
  });

  describe("on setTextFilterAction", () => {
    it("should set text sample filter", () => {
      const text = "test";
      const action = fromActions.setTextFilterAction({ text });
      const state = samplesReducer(initialSampleState, action);

      expect(state.samplefilters.text).toEqual(text);
    });
  });
});
