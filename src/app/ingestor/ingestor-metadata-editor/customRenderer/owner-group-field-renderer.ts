import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import { RankedTester, rankWith, scopeEndsWith } from "@jsonforms/core";
import { Store } from "@ngrx/store";
import { selectUserSettingsPageViewModel } from "state-management/selectors/user.selectors";
import { fetchCurrentUserAction } from "state-management/actions/user.actions";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

@Component({
  selector: "owner-group-renderer",
  styleUrls: ["../ingestor-metadata-editor.component.scss"],
  template: `
    <div>
      <mat-form-field
        [ngStyle]="{ display: hidden ? 'none' : '' }"
        *ngIf="userOwnerGroups && userOwnerGroups.length > 0"
        class="custom-input-box"
      >
        <mat-label>{{ label }}</mat-label>
        <input
          type="text"
          class="custom-input-box"
          matInput
          [id]="id"
          [matAutocomplete]="auto"
          [formControl]="form"
          (input)="onChange($event)"
          (focus)="focused = true"
          (focusout)="focused = false"
        />
        <mat-autocomplete
          #auto="matAutocomplete"
          (optionSelected)="onSelectAutocompleteValue($event)"
        >
          <mat-option
            *ngFor="let ownerGroup of userOwnerGroups"
            [value]="ownerGroup"
          >
            {{ ownerGroup }}
          </mat-option>
        </mat-autocomplete>
        <mat-hint *ngIf="shouldShowUnfocusedDescription() || focused">{{
          description
        }}</mat-hint>
        <mat-error>{{ error }}</mat-error>
      </mat-form-field>

      <mat-form-field
        [ngStyle]="{ display: hidden ? 'none' : '' }"
        *ngIf="!userOwnerGroups || userOwnerGroups.length === 0"
        class="custom-input-box"
      >
        <mat-label>{{ label }}</mat-label>
        <input
          type="text"
          class="custom-input-box"
          matInput
          [id]="id"
          [formControl]="form"
          (input)="onChange($event)"
          (focus)="focused = true"
          (focusout)="focused = false"
        />
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerGroupFieldComponent
  extends JsonFormsControl
  implements OnInit
{
  focused = false;
  vm$ = this.store.select(selectUserSettingsPageViewModel);
  userOwnerGroups = [];
  groupFieldInitialized = false;

  constructor(
    jsonformsService: JsonFormsAngularService,
    private store: Store,
  ) {
    super(jsonformsService);
  }

  getEventValue = (event: any) => event.target.value || undefined;

  ngOnInit() {
    // Call ngOnInit from super class
    super.ngOnInit();

    // Fetch the owner groups from the scicat user
    this.vm$.subscribe((settings) => {
      const getclaims = (profile: any): string[] => {
        if (!profile) {
          return [];
        }

        if (profile.oidcClaims !== undefined) {
          return settings.profile.oidcClaims.accessGroups ?? [];
        }

        if (profile.accessGroups !== undefined) {
          return settings.profile.accessGroups ?? [];
        }

        return [];
      };

      const claims = getclaims(settings.profile);
      if (claims.length > 0) {
        this.userOwnerGroups = claims;
      }

      if (!this.groupFieldInitialized) {
        this.groupFieldInitialized = true;
        this.store.dispatch(fetchCurrentUserAction());
      }

      if (this.form.disabled) {
        this.form.enable();
      }
    });
  }

  onSelectAutocompleteValue($event: MatAutocompleteSelectedEvent) {
    const selectedValue = $event.option.value;
    // Create a fake json from event
    const fakeChangeEvent = {
      target: {
        value: selectedValue,
      },
    };
    this.onChange(fakeChangeEvent);
  }
}

export const ownerGroupFieldTester: RankedTester = rankWith(
  2,
  scopeEndsWith("ownerGroup"),
);
