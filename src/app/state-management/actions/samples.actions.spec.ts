import * as fromActions from "./samples.actions";
import { Attachment, Sample, Dataset } from "../../shared/sdk/models";

describe("Sample Actions", () => {
  describe("fetchSamplesAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchSamplesAction();
      expect({ ...action }).toEqual({ type: "[Sample] Fetch Samples" });
    });
  });

  describe("fetchSamplesCompleteAction", () => {
    it("should create an action", () => {
      const samples = [new Sample()];
      const action = fromActions.fetchSamplesCompleteAction({ samples });
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Samples Complete",
        samples
      });
    });
  });

  describe("fetchSamplesFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchSamplesFailedAction();
      expect({ ...action }).toEqual({ type: "[Sample] Fetch Samples Failed" });
    });
  });

  describe("fetchSamplesCountAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchSamplesCountAction();
      expect({ ...action }).toEqual({ type: "[Sample] Fetch Samples Count" });
    });
  });

  describe("fetchSamplesCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchSamplesCountCompleteAction({ count });
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Samples Count Complete",
        count
      });
    });
  });

  describe("fetchSamplesCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchSamplesCountFailedAction();
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Samples Count Failed"
      });
    });
  });

  describe("fetchSampleAction", () => {
    it("should create an action", () => {
      const sampleId = "testId";
      const action = fromActions.fetchSampleAction({ sampleId });
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Sample",
        sampleId
      });
    });
  });

  describe("fetchSampleCompleteAction", () => {
    it("should create an action", () => {
      const sample = new Sample();
      const action = fromActions.fetchSampleCompleteAction({ sample });
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Sample Complete",
        sample
      });
    });
  });

  describe("fetchSampleFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchSampleFailedAction();
      expect({ ...action }).toEqual({ type: "[Sample] Fetch Sample Failed" });
    });
  });

  describe("fetchSampleDatasetsAction", () => {
    it("should create an action", () => {
      const sampleId = "testId";
      const action = fromActions.fetchSampleDatasetsAction({ sampleId });
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Datasets",
        sampleId
      });
    });
  });

  describe("fetchSampleDatasetsCompleteAction", () => {
    it("should create an action", () => {
      const datasets = [new Dataset()];
      const action = fromActions.fetchSampleDatasetsCompleteAction({
        datasets
      });
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Datasets Complete",
        datasets
      });
    });
  });

  describe("fetchSampleDatasetsFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchSampleDatasetsFailedAction();
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Datasets Failed"
      });
    });
  });

  describe("fetchSampleDatasetsCountAction", () => {
    it("should create an action", () => {
      const sampleId = "testId";
      const action = fromActions.fetchSampleDatasetsCountAction({ sampleId });
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Datasets Count",
        sampleId
      });
    });
  });

  describe("fetchSampleDatasetsCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchSampleDatasetsCountCompleteAction({
        count
      });
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Datasets Count Complete",
        count
      });
    });
  });

  describe("fetchSampleDatasetsCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchSampleDatasetsCountFailedAction();
      expect({ ...action }).toEqual({
        type: "[Sample] Fetch Datasets Count Failed"
      });
    });
  });

  describe("addSampleAction", () => {
    it("should create an action", () => {
      const sample = new Sample();
      const action = fromActions.addSampleAction({ sample });
      expect({ ...action }).toEqual({
        type: "[Sample] Add Sample",
        sample
      });
    });
  });

  describe("addSampleCompleteAction", () => {
    it("should create an action", () => {
      const sample = new Sample();
      const action = fromActions.addSampleCompleteAction({ sample });
      expect({ ...action }).toEqual({
        type: "[Sample] Add Sample Complete",
        sample
      });
    });
  });

  describe("addSampleFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.addSampleFailedAction();
      expect({ ...action }).toEqual({ type: "[Sample] Add Sample Failed" });
    });
  });

  describe("saveCharacteristicsAction", () => {
    it("should create an action", () => {
      const sampleId = "testId";
      const characteristics = {};
      const action = fromActions.saveCharacteristicsAction({
        sampleId,
        characteristics
      });
      expect({ ...action }).toEqual({
        type: "[Sample] Save Characteristics",
        sampleId,
        characteristics
      });
    });
  });

  describe("saveCharacteristicsCompleteAction", () => {
    it("should create an action", () => {
      const sample = new Sample();
      const action = fromActions.saveCharacteristicsCompleteAction({ sample });
      expect({ ...action }).toEqual({
        type: "[Sample] Save Characteristics Complete",
        sample
      });
    });
  });

  describe("saveCharacteristicsFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.saveCharacteristicsFailedAction();
      expect({ ...action }).toEqual({
        type: "[Sample] Save Characteristics Failed"
      });
    });
  });

  describe("addAttachmentAction", () => {
    it("should create an action", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentAction({ attachment });
      expect({ ...action }).toEqual({
        type: "[Sample] Add Attachment",
        attachment
      });
    });
  });

  describe("addAttachmentCompleteAction", () => {
    it("should create an action", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentCompleteAction({ attachment });
      expect({ ...action }).toEqual({
        type: "[Sample] Add Attachment Complete",
        attachment
      });
    });
  });

  describe("addAttachmentAction", () => {
    it("should create an action", () => {
      const action = fromActions.addAttachmentFailedAction();
      expect({ ...action }).toEqual({
        type: "[Sample] Add Attachment Failed"
      });
    });
  });

  describe("updateAttachmentCaption", () => {
    it("should create an action", () => {
      const sampleId = "123abc";
      const attachmentId = "abc123";
      const caption = "New caption";
      const action = fromActions.updateAttachmentCaptionAction({
        sampleId,
        attachmentId,
        caption
      });
      expect({ ...action }).toEqual({
        type: "[Sample] Update Attachment Caption",
        sampleId,
        attachmentId,
        caption
      });
    });
  });

  describe("updateAttachmentCompleteCaption", () => {
    it("should create an action", () => {
      const attachment = new Attachment();
      const action = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });
      expect({ ...action }).toEqual({
        type: "[Sample] Update Attachment Caption Complete",
        attachment
      });
    });
  });

  describe("updateAttachmentFailedCaption", () => {
    it("should create an action", () => {
      const action = fromActions.updateAttachmentCaptionFailedAction();
      expect({ ...action }).toEqual({
        type: "[Sample] Update Attachment Caption Failed"
      });
    });
  });

  describe("removeAttachmentAction", () => {
    it("should create an action", () => {
      const sampleId = "123abc";
      const attachmentId = "abc123";
      const action = fromActions.removeAttachmentAction({
        sampleId,
        attachmentId
      });
      expect({ ...action }).toEqual({
        type: "[Sample] Remove Attachment",
        sampleId,
        attachmentId
      });
    });
  });

  describe("removeAttachmentCompleteAction", () => {
    it("should create an action", () => {
      const attachmentId = "abc123";
      const action = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });
      expect({ ...action }).toEqual({
        type: "[Sample] Remove Attachment Complete",
        attachmentId
      });
    });
  });

  describe("removeAttachmentFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.removeAttachmentFailedAction();
      expect({ ...action }).toEqual({
        type: "[Sample] Remove Attachment Failed"
      });
    });
  });

  describe("changePageAction", () => {
    it("should create an action", () => {
      const page = 1;
      const limit = 25;
      const action = fromActions.changePageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Sample] Change Page",
        page,
        limit
      });
    });
  });

  describe("changeDatasetsPageAction", () => {
    it("should create an action", () => {
      const page = 1;
      const limit = 25;
      const action = fromActions.changeDatasetsPageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Sample] Change Datasets Page",
        page,
        limit
      });
    });
  });

  describe("sortByColumnAction", () => {
    it("should create an action", () => {
      const column = "test";
      const direction = "asc";
      const action = fromActions.sortByColumnAction({ column, direction });
      expect({ ...action }).toEqual({
        type: "[Sample] Sort By Column",
        column,
        direction
      });
    });
  });

  describe("setTextFilterAction", () => {
    it("should create an action", () => {
      const text = "test";
      const action = fromActions.setTextFilterAction({ text });
      expect({ ...action }).toEqual({
        type: "[Sample] Set Text Filter",
        text
      });
    });
  });
});
