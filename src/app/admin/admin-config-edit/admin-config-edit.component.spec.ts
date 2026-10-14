import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { selectConfig } from "state-management/selectors/runtime-config.selectors";
import { updateConfiguration } from "state-management/actions/runtime-config.action";
import { ControlElement, GroupLayout, Layout } from "@jsonforms/core";
import { AdminConfigEditComponent } from "./admin-config-edit.component";

describe("AdminConfigEditComponent internal link labels", () => {
  let fixture: ComponentFixture<AdminConfigEditComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminConfigEditComponent],
      imports: [SharedScicatFrontendModule, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectConfig,
              value: {
                data: {
                  labelsLocalization: { dataset: {}, proposal: {} },
                  datasetDetailsTabsInclude: { details: ["proposals"] },
                  datasetDetailComponent: {
                    enableCustomizedComponent: true,
                    customization: [
                      {
                        type: "regular",
                        label: "Related Documents",
                        order: 0,
                        col: 1,
                        row: 1,
                        fields: [
                          {
                            element: "internalLink",
                            source: "proposalIds",
                            internalLinkLabel: "id",
                            order: 0,
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          ],
        }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AdminConfigEditComponent);
    const group = (fixture.componentInstance.uiSchema as any).elements.find(
      (element) => element.label === "Dataset Detail Component",
    );
    fixture.componentInstance.uiSchema = {
      type: "VerticalLayout",
      elements: [{ ...group, options: { expandable: false } }],
    } as any;
  });

  afterEach(() => fixture.destroy());

  it("should save an edited label property from the actual JSONForms field", async () => {
    fixture.autoDetectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const labelInput = Array.from(
      fixture.nativeElement.querySelectorAll("input"),
    ).find(
      (input: HTMLInputElement) => input.value === "id",
    ) as HTMLInputElement;
    expect(labelInput).toBeTruthy();
    labelInput.value = "title";
    labelInput.dispatchEvent(new Event("input", { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const dispatch = spyOn(store, "dispatch");
    fixture.componentInstance.save();
    const action = dispatch.calls.mostRecent().args[0] as unknown as ReturnType<
      typeof updateConfiguration
    >;
    expect(action.type).toBe(updateConfiguration.type);
    expect(
      action.config.datasetDetailComponent.customization[0].fields[0]
        .internalLinkLabel,
    ).toBe("title");
    expect(action.config.datasetDetailsTabsInclude.details).toEqual([
      "proposals",
    ]);
  });
});

describe("AdminConfigEditComponent datafiles action conditions", () => {
  let fixture: ComponentFixture<AdminConfigEditComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminConfigEditComponent],
      imports: [SharedScicatFrontendModule, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectConfig,
              value: {
                data: {
                  labelsLocalization: { dataset: {}, proposal: {} },
                  datafilesActions: [
                    {
                      id: "download",
                      label: "Download",
                      enabled: "#Length(@files) > 0",
                      disabled: "true",
                    },
                  ],
                },
              },
            },
          ],
        }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AdminConfigEditComponent);
    const group = (fixture.componentInstance.uiSchema as Layout).elements.find(
      (element) => (element as GroupLayout).label === "Datafiles Actions",
    ) as GroupLayout;
    const control: ControlElement = {
      type: "Control",
      scope: "#/properties/datafilesActions",
      // the action's detail form for every action, without the master list
      options: { detail: group.elements[0].options?.detail },
    };
    const uiSchema: Layout = { type: "VerticalLayout", elements: [control] };
    fixture.componentInstance.uiSchema = uiSchema;
  });

  afterEach(() => fixture.destroy());

  it("should edit a string enabled as conditions and save that form", async () => {
    fixture.autoDetectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const inputs = Array.from(
      fixture.nativeElement.querySelectorAll("input"),
    ) as HTMLInputElement[];
    const conditionInput = inputs.find(
      (i) => i.value === "#Length(@files) > 0",
    );
    expect(conditionInput).toBeTruthy();
    conditionInput.value = "#Length(@files) > 1";
    conditionInput.dispatchEvent(new Event("input", { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const dispatch = spyOn(store, "dispatch");
    fixture.componentInstance.save();
    const action = dispatch.calls.mostRecent().args[0] as unknown as ReturnType<
      typeof updateConfiguration
    >;
    expect(action.config.datafilesActions[0].enabled).toEqual({
      conditions: [{ condition: "#Length(@files) > 1" }],
    });
    expect(action.config.datafilesActions[0].disabled).toBeUndefined();
  });
});
