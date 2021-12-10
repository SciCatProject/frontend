import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetFileUploaderComponent } from "./dataset-file-uploader.component";

describe("DatasetFileUploaderComponent", () => {
  let component: DatasetFileUploaderComponent;
  let fixture: ComponentFixture<DatasetFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetFileUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
