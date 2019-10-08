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

  totalCount: 0,

  isLoading: false,

  filters: {
    text: "",
    sortField: "creationTime:desc",
    skip: 0,
    limit: 25
  }
};

describe("SamplesReducer", () => {
  describe("on fetchSamplesAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchSamplesAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toBe(true);
    });
  });

  describe("on fetchSamplesCompleteAction", () => {
    it("should set samples, totalCount and set isLoading to false", () => {
      const samples = [sample];
      const action = fromActions.fetchSamplesCompleteAction({ samples });
      const state = samplesReducer(initialSampleState, action);

      expect(state.samples).toEqual(samples);
      expect(state.totalCount).toEqual(samples.length);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchSamplesFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchSamplesFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toBe(false);
    });
  });

  describe("on fetchSampleAction", () => {
    it("should set isLoading to true", () => {
      const sampleId = "testId";
      const action = fromActions.fetchSampleAction({ sampleId });
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toBe(true);
    });
  });

  describe("on fetchSampleCompleteAction", () => {
    it("should set currentSample and set isLoading to false", () => {
      const action = fromActions.fetchSampleCompleteAction({ sample });
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample).toEqual(sample);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("on fetchSampleFailedAction", () => {
    it("should set samplesLoading to false", () => {
      const action = fromActions.fetchSampleFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toBe(false);
    });
  });

  describe("on fetchSampleDatasetsAction", () => {
    it("should set isLoading to true", () => {
      const sampleId = "testId";
      const action = fromActions.fetchSampleDatasetsAction({ sampleId });
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toBe(true);
    });
  });

  describe("on fetchSampleDatasetsCompleteAction", () => {
    it("should set datasets and set isLoading to false", () => {
      const datasets = [new Dataset()];
      const action = fromActions.fetchSampleDatasetsCompleteAction({
        datasets
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.datasets).toEqual(datasets);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("on fetchSampleDatasetsFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchSampleDatasetsFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toBe(false);
    });
  });

  describe("on addSampleAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.addSampleAction({ sample });
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on addSampleCompleteAction", () => {
    it("should add the new sample to samples and set isLoading to false", () => {
      const action = fromActions.addSampleCompleteAction({ sample });
      const state = samplesReducer(initialSampleState, action);

      expect(state.samples).toEqual([sample]);
    });
  });

  describe("on addSampleFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.addSampleFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on addAttachmentAction", () => {
    it("should set isLoading to true", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentAction({ attachment });
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on addAttachmentCompleteAction", () => {
    it("should set attachments for currentSample and set isLoading to false", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentCompleteAction({
        attachment
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample.attachments).toContain(attachment);
    });
  });

  describe("on addAttachmentFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.addAttachmentFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on updateAttachmentCaptionAction", () => {
    it("should set isLoading to true", () => {
      const sampleId = "testId";
      const attachmentId = "testId";
      const caption = "test";
      const action = fromActions.updateAttachmentCaptionAction({
        sampleId,
        attachmentId,
        caption
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on updateAttachmentCaptionCompleteAction", () => {
    it("should set attachments for currentSample and set isLoading to false", () => {
      const attachment = new Attachment();
      const action = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample.attachments).toContain(attachment);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on updateAttachmentCaptionFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.updateAttachmentCaptionFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on removeAttachmentAction", () => {
    it("should set isLoading to true", () => {
      const sampleId = "testId";
      const attachmentId = "testId";
      const action = fromActions.removeAttachmentAction({
        sampleId,
        attachmentId
      });
      const state = samplesReducer(initialSampleState, action);
      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on removeAttachmentCompleteAction", () => {
    it("should set attachments for currentSample and set isLoading to false", () => {
      const attachment = new Attachment();
      const attachmentId = "testId";
      attachment.id = attachmentId;
      initialSampleState.currentSample.attachments = [attachment];

      const action = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.currentSample.attachments).toEqual([]);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on removeAttachmentFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.removeAttachmentFailedAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit filters", () => {
      const page = 2;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changePageAction({ page, limit });
      const state = samplesReducer(initialSampleState, action);

      expect(state.filters.limit).toEqual(limit);
      expect(state.filters.skip).toEqual(skip);
    });
  });

  describe("on sortByColumnAction", () => {
    it("should set sortField filter and set skip to 0", () => {
      const column = "test";
      const direction = "asc";
      const sortField = column + (direction ? ":" + direction : "");
      const action = fromActions.sortByColumnAction({ column, direction });
      const state = samplesReducer(initialSampleState, action);

      expect(state.filters.sortField).toEqual(sortField);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on setTextFilterAction", () => {
    it("should set text filter", () => {
      const text = "test";
      const action = fromActions.setTextFilterAction({ text });
      const state = samplesReducer(initialSampleState, action);

      expect(state.filters.text).toEqual(text);
    });
  });
});
