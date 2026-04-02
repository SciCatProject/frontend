import { TestBed } from "@angular/core/testing";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import {
  showMessageAction,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import {
  selectColumnsWithHasFetchedSettings,
  selectCurrentUser,
} from "state-management/selectors/user.selectors";
import {
  ScientificMetadataColumnEntry,
  ScientificMetadataColumnsService,
} from "./scientific-metadata-columns.service";

describe("ScientificMetadataColumnsService", () => {
  let service: ScientificMetadataColumnsService;
  let store: jasmine.SpyObj<Store>;

  const entry: ScientificMetadataColumnEntry = {
    name: "beam_size",
    columnName: "scientificMetadata.beam_size.value",
    human_name: "Beam Size",
  };

  beforeEach(() => {
    store = jasmine.createSpyObj<Store>("Store", ["select", "dispatch"]);
    store.select.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        ScientificMetadataColumnsService,
        { provide: Store, useValue: store },
      ],
    });

    service = TestBed.inject(ScientificMetadataColumnsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should build a standard user-added scientific metadata column without path", () => {
    expect(service.buildColumn(entry, 3)).toEqual({
      name: "scientificMetadata.beam_size.value",
      header: "Beam Size",
      userAdded: true,
      order: 3,
      type: "standard",
      enabled: true,
      tooltip: "beam_size",
      width: 250,
    });
  });

  it("should upsert an existing column without duplicating it", () => {
    const result = service.upsertColumn(
      [
        {
          name: "scientificMetadata.beam_size.value",
          header: "Old Beam Size",
          order: 7,
          type: "standard",
          enabled: false,
        },
      ],
      entry,
    );

    expect(result).toEqual([
      {
        name: "scientificMetadata.beam_size.value",
        header: "Beam Size",
        userAdded: true,
        order: 7,
        type: "standard",
        enabled: true,
        tooltip: "beam_size",
        width: 250,
      },
    ]);
  });

  it("should dispatch an info message when no user is logged in", async () => {
    store.select.and.callFake((selector: unknown) => {
      if (selector === selectCurrentUser) {
        return of(undefined);
      }

      return of(undefined);
    });

    await service.addMetadataColumn(entry);

    expect(store.dispatch).toHaveBeenCalledWith(
      showMessageAction({
        message: jasmine.objectContaining({
          content: "Log in to save dataset list columns.",
        }) as any,
      }),
    );
  });

  it("should dispatch a settings update and success message", async () => {
    store.select.and.callFake((selector: unknown) => {
      if (selector === selectCurrentUser) {
        return of({ id: "user-1" } as any);
      }

      if (selector === selectColumnsWithHasFetchedSettings) {
        return of({
          columns: [
            {
              name: "datasetName",
              order: 0,
              type: "standard",
              enabled: true,
            },
          ],
          hasFetchedSettings: true,
        });
      }

      return of(undefined);
    });

    await service.addMetadataColumn(entry);

    expect(store.dispatch.calls.argsFor(0)[0]).toEqual(
      updateUserSettingsAction({
        property: {
          columns: [
            {
              name: "datasetName",
              order: 0,
              type: "standard",
              enabled: true,
            },
            {
              name: "scientificMetadata.beam_size.value",
              header: "Beam Size",
              userAdded: true,
              order: 1,
              type: "standard",
              enabled: true,
              tooltip: "beam_size",
              width: 250,
            },
          ],
        },
      }),
    );
    expect(store.dispatch.calls.argsFor(1)[0]).toEqual(
      showMessageAction({
        message: jasmine.objectContaining({
          content: '"Beam Size" was added to the datasets list.',
        }) as any,
      }),
    );
  });
});
