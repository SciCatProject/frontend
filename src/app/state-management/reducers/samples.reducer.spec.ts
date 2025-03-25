import { samplesReducer } from "./samples.reducer";
import { initialSampleState } from "../state/samples.store";
import * as fromActions from "../actions/samples.actions";
import { SampleFilters, ScientificCondition } from "../models";
import {
  createMock,
  mockDataset as dataset,
  mockAttachment as attachment,
} from "shared/MockStubs";
import { SampleClass } from "@scicatproject/scicat-sdk-ts-angular";

const sample = createMock<SampleClass>({
  sampleId: "testId",
  ownerGroup: "testGroup",
  createdBy: "",
  updatedBy: "",
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  accessGroups: [],
  isPublished: false,
});

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

  describe("on fetchMetadataKeysCompleteAction", () => {
    it("should set metadataKeys", () => {
      const metadataKeys = ["volume"];
      const action = fromActions.fetchMetadataKeysCompleteAction({
        metadataKeys,
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.metadataKeys).toEqual(metadataKeys);
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
      const datasets = [dataset];
      const action = fromActions.fetchSampleDatasetsCompleteAction({
        datasets,
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.datasets).toEqual(datasets);
    });
  });

  describe("on fetchSampleDatasetsCountCompleteAction", () => {
    it("should set datasetsCount", () => {
      const count = 100;
      const action = fromActions.fetchSampleDatasetsCountCompleteAction({
        count,
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
      initialSampleState.currentSample = sample;

      const action = fromActions.addAttachmentCompleteAction({
        attachment,
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.attachments).toContain(attachment);
    });
  });

  describe("on updateAttachmentCaptionCompleteAction", () => {
    it("should set attachments for currentSample", () => {
      initialSampleState.currentSample = sample;

      const action = fromActions.updateAttachmentCaptionCompleteAction({
        attachment,
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.attachments).toContain(attachment);
    });
  });

  describe("on removeAttachmentCompleteAction", () => {
    it("should set attachments for currentSample", () => {
      initialSampleState.currentSample = sample;
      const attachmentId = "testId";
      attachment.id = attachmentId;
      initialSampleState.attachments = [attachment];

      const action = fromActions.removeAttachmentCompleteAction({
        attachmentId,
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.attachments).toEqual([]);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit sampleFilters", () => {
      const page = 2;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changePageAction({ page, limit });
      const state = samplesReducer(initialSampleState, action);

      expect(state.sampleFilters.limit).toEqual(limit);
      expect(state.sampleFilters.skip).toEqual(skip);
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

      expect(state.sampleFilters.sortField).toEqual(sortField);
      expect(state.sampleFilters.skip).toEqual(0);
    });
  });

  describe("on prefillFiltersAction", () => {
    it("should set sampleFilters and set hasPrefilledFilters to true", () => {
      const values: Partial<SampleFilters> = {
        text: "test",
      };
      const action = fromActions.prefillFiltersAction({ values });
      const state = samplesReducer(initialSampleState, action);

      expect(state.sampleFilters.text).toEqual(values.text);
      expect(state.hasPrefilledFilters).toEqual(true);
    });
  });

  describe("on setTextFilterAction", () => {
    it("should set text sample filter", () => {
      const text = "test";
      const action = fromActions.setTextFilterAction({ text });
      const state = samplesReducer(initialSampleState, action);

      expect(state.sampleFilters.text).toEqual(text);
    });
  });

  describe("on addCharacteristicsFilterAction", () => {
    it("should add characteristic to characteristics filter", () => {
      const characteristic: ScientificCondition = {
        lhs: "lhsTest",
        relation: "EQUAL_TO_STRING",
        rhs: "rhsTest",
        unit: "",
      };

      const action = fromActions.addCharacteristicsFilterAction({
        characteristic,
      });
      const state = samplesReducer(initialSampleState, action);

      expect(state.sampleFilters.characteristics).toContain(characteristic);
    });
  });

  describe("on removeCharacteristicsFilterAction", () => {
    it("should remove characteristic from characteristics filter", () => {
      const characteristic: ScientificCondition = {
        lhs: "lhsTest",
        relation: "EQUAL_TO_STRING",
        rhs: "rhsTest",
        unit: "",
      };

      initialSampleState.sampleFilters.characteristics.push(characteristic);

      expect(initialSampleState.sampleFilters.characteristics).toContain(
        characteristic,
      );

      const index = 0;

      const action = fromActions.removeCharacteristicsFilterAction({ index });
      const state = samplesReducer(initialSampleState, action);

      expect(state.sampleFilters.characteristics).not.toContain(characteristic);
    });
  });

  describe("on clearSamplesStateAction", () => {
    it("should set samples state to initialSampleState", () => {
      const action = fromActions.clearSamplesStateAction();
      const state = samplesReducer(initialSampleState, action);

      expect(state).toEqual(initialSampleState);
    });
  });
});
