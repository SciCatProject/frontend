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
  styleUrls: ["./ingestor-renderer.component.scss"],
  templateUrl: "./owner-group-field-renderer.html",
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
        const getclaims = (profile: any): string[] | null => {
          if (!profile) {
            return null;
          }

          if (profile.oidcClaims !== undefined) {
            return settings.profile.oidcClaims.accessGroups ?? null;
          }

          if (profile.accessGroups !== undefined) {
            return settings.profile.accessGroups ?? null;
          }

          return null;
        };

        const claims = getclaims(settings.profile);
        if (claims !== null && claims.length > 0) {
          this.userOwnerGroups = claims;
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
