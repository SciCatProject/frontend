import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import { DatafilesComponent } from "datasets/datafiles/datafiles.component";
import { MockActivatedRoute, MockStore } from "shared/MockStubs";
import { rootReducer } from "state-management/reducers/root.reducer";
import { MatTableModule } from "@angular/material";
import { FilePickerComponent } from "./file-picker.component";
import { APP_CONFIG } from "../../../../app-config.module";
import * as lb from "shared/sdk/services";
import { PipesModule } from "shared/pipes/pipes.module";

const mockConfig = {};

describe("FilePickerComponent", () => {
  let component: FilePickerComponent;
  let fixture: ComponentFixture<FilePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        MatTableModule,
        PipesModule,
        StoreModule.forRoot({ rootReducer })
      ],
      declarations: [
        FilePickerComponent,
        DatafilesComponent
      ]
    });
    TestBed.overrideComponent(FilePickerComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: APP_CONFIG, useValue: mockConfig },
          { provide: lb.AttachmentApi, useValue: mockConfig },
          { provide: Store, useClass: MockStore }
        ]
      }
    });
    TestBed.compileComponents();
  }));


  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
