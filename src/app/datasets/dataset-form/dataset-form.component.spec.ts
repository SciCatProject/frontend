import { DatasetFormComponent } from "./dataset-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockStore } from "../../shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { KeysPipe } from "../../shared/pipes";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { rootReducer } from "../../state-management/reducers/root.reducer";

import { Datablock, DatasetAttachment, DatasetLifecycle, OrigDatablock, Proposal, RawDataset, Sample } from "../../shared/sdk/models";
import { DatasetState } from "../../state-management/state/datasets.store";

describe("DatasetFormComponent", () => {
  let component: DatasetFormComponent;
  let fixture: ComponentFixture<DatasetFormComponent>;
  let store: Store<DatasetState>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetFormComponent, KeysPipe],
      imports: [
        StoreModule.forRoot({
          rootReducer
        }),
        FormsModule, ReactiveFormsModule, FontAwesomeModule]
    });
    TestBed.overrideComponent(DatasetFormComponent, {
      set: {
        providers: [{ provide: Store, useClass: MockStore }]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
  });

  it("should create", () => {
    const date = new Date();
    const dataset: RawDataset = {
      principalInvestigator: "string",
      endTime: date,
      creationLocation: "string",
      dataFormat: "string",
      scientificMetadata: {},
      pid: "string",
      owner: "string",
      ownerEmail: "string",
      orcidOfOwner: "string",
      contactEmail: "string",
      sourceFolder: "string",
      datasetName: "string",
      size: 0,
      packedSize: 0,
      creationTime: date,
      type: "string",
      validationStatus: "string",
      keywords: ["string"],
      description: "string",
      userTargetLocation: "string",
      classification: "string",
      license: "string",
      version: "string",
      doi: "string",
      isPublished: true,
      archivable: true,
      retrievable: true,
      publishable: true,
      ownerGroup: "string",
      accessGroups: ["string"],
      createdBy: "string",
      updatedBy: "string",
      createdAt: date,
      updatedAt: date,
      sample: new Sample(),
      proposal: new Proposal(),
      sampleId: "string",
      datasetlifecycle: new DatasetLifecycle(),
      datasetattachments: [new DatasetAttachment()],
      datablocks: [new Datablock()],
      origdatablocks: [new OrigDatablock()],
      proposalId: "string"
    };
    // store.select.returnValue( of (dataset));

    expect(component).toBeTruthy();
  });
});
