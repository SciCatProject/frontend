import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { AppConfigService } from "app-config.service";
import { DatasetsService } from "@scicatproject/scicat-sdk-ts-angular";
import {
  selectIsAdmin,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { DatasetInlineEditCellComponent } from "./dataset-inline-edit-cell.component";

describe("DatasetInlineEditCellComponent", () => {
  let component: DatasetInlineEditCellComponent;
  let fixture: ComponentFixture<DatasetInlineEditCellComponent>;
  let datasetsService: jasmine.SpyObj<DatasetsService>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      declarations: [DatasetInlineEditCellComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectProfile,
              value: { accessGroups: ["owner-group"] },
            },
            { selector: selectIsAdmin, value: false },
          ],
        }),
        {
          provide: AppConfigService,
          useValue: {
            getConfig: () => ({ editDatasetEnabled: true }),
          },
        },
        {
          provide: DatasetsService,
          useValue: jasmine.createSpyObj("DatasetsService", [
            "datasetsControllerFindByIdAndUpdateV3",
          ]),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetInlineEditCellComponent);
    component = fixture.componentInstance;
    datasetsService = TestBed.inject(
      DatasetsService,
    ) as jasmine.SpyObj<DatasetsService>;
    component.row = {
      pid: "dataset-1",
      ownerGroup: "owner-group",
      comment: "original",
    } as any;
    component.column = { name: "comment" } as any;
    fixture.detectChanges();
  });

  it("should allow editing for users in the dataset owner group", () => {
    expect(component.canEdit).toBeTrue();
  });

  it("should persist the updated field and update the row locally", () => {
    datasetsService.datasetsControllerFindByIdAndUpdateV3.and.returnValue(
      of(null),
    );

    component.beginEdit(new MouseEvent("click"));
    component.draftValue = "updated";
    component.saveValue();

    expect(
      datasetsService.datasetsControllerFindByIdAndUpdateV3,
    ).toHaveBeenCalledWith("dataset-1", { comment: "updated" });
    expect(component.row.comment).toBe("updated");
    expect(component.isEditing).toBeFalse();
  });

  it("should not allow editing when the user lacks access", () => {
    component.row = {
      pid: "dataset-1",
      ownerGroup: "other-group",
      comment: "original",
    } as any;
    fixture.detectChanges();

    expect(component.canEdit).toBeFalse();
  });
});
