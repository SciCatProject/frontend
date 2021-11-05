import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PublicDownloadDialogComponent } from "./public-download-dialog.component";

describe("PublicDownloadDialogComponent", () => {
  let component: PublicDownloadDialogComponent;
  let fixture: ComponentFixture<PublicDownloadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicDownloadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
