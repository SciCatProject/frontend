import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import { RankedTester, rankWith, scopeEndsWith } from "@jsonforms/core";
import { Store } from "@ngrx/store";
import { selectUserSettingsPageViewModel } from "state-management/selectors/user.selectors";
import { fetchCurrentUserAction } from "state-management/actions/user.actions";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Subscription } from "rxjs";

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
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerGroupFieldComponent
  extends JsonFormsControl
  implements OnInit, OnDestroy
{
  private componentSubscriptions: Subscription[] = [];
  focused = false;
  vm$ = this.store.select(selectUserSettingsPageViewModel);
  userOwnerGroups = [];

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
    this.componentSubscriptions.push(
      this.vm$.subscribe((settings) => {
        const getPossibleOwnerGroups = (profile: any): string[] | null => {
          if (!profile) {
            return null;
          }

          var accessGroups = profile.accessGroups ?? null;

          return accessGroups;
        };

        const ownerGroups = getPossibleOwnerGroups(settings.profile);
        if (ownerGroups !== null && ownerGroups.length > 0) {
          this.userOwnerGroups = ownerGroups;
        } else {
          this.userOwnerGroups = [];

          // Fetch the current user to get the owner groups if not available
          this.store.dispatch(fetchCurrentUserAction());
        }

        if (this.form.disabled) {
          this.form.enable();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe(),
    );
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
