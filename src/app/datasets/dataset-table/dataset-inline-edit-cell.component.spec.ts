import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Store } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { AppConfigService } from "app-config.service";
import { updatePropertyInlineAction } from "state-management/actions/datasets.actions";
import {
  selectIsAdmin,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { DatasetInlineEditCellComponent } from "./dataset-inline-edit-cell.component";

describe("DatasetInlineEditCellComponent", () => {
  let component: DatasetInlineEditCellComponent;
  let fixture: ComponentFixture<DatasetInlineEditCellComponent>;
  let store: Store;

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
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetInlineEditCellComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
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

  it("should dispatch an inline update action and update the row locally", () => {
    spyOn(store, "dispatch");

    component.beginEdit(new MouseEvent("click"));
    component.draftValue = "updated";
    component.saveValue();

    expect(store.dispatch).toHaveBeenCalledWith(
      updatePropertyInlineAction({
        pid: "dataset-1",
        property: { comment: "updated" },
      }),
    );
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
