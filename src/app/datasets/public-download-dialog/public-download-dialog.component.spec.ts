import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MockMatDialogRef } from "shared/MockStubs";

import { PublicDownloadDialogComponent } from "./public-download-dialog.component";

describe("PublicDownloadDialogComponent", () => {
  let component: PublicDownloadDialogComponent;
  let fixture: ComponentFixture<PublicDownloadDialogComponent>;

  beforeEach(
    waitForAsync(() =>{
      TestBed.configureTestingModule({
        declarations: [ PublicDownloadDialogComponent ],
        imports:[
          MatDialogModule
        ]
      });
      TestBed.overrideComponent(PublicDownloadDialogComponent, {
        set: {
          providers: [
            { provide: MatDialogRef, useClass: MockMatDialogRef },
            { provide: MAT_DIALOG_DATA, useClass: MockMatDialogRef },],
        },
      });
      TestBed.compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
