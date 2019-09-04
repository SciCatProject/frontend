import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { DatafilesComponent } from "./datafiles.component";
import { MatTableModule } from "@angular/material";
import { Store } from "@ngrx/store";
import { MockStore, MockUserApi } from "shared/MockStubs";
import { AppConfigModule } from "app-config.module";
import { FileSizePipe } from "../../shared/pipes/filesize.pipe";
import { UserApi } from "shared/sdk";
import { FilePathTruncate } from "shared/pipes/file-path-truncate.pipe";

describe("DatafilesComponent", () => {
  let component: DatafilesComponent;
  let fixture: ComponentFixture<DatafilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, MatTableModule, AppConfigModule],
      declarations: [DatafilesComponent, FileSizePipe, FilePathTruncate]
    });
    TestBed.overrideComponent(DatafilesComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          { provide: UserApi, useClass: MockUserApi }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatafilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
