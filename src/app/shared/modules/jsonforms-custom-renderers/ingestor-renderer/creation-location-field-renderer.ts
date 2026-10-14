import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import { RankedTester, rankWith, scopeEndsWith } from "@jsonforms/core";
import { Store } from "@ngrx/store";
import { selectIngestorStatus } from "state-management/selectors/ingestor.selectors";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Subscription } from "rxjs";

@Component({
  selector: "creation-location-renderer",
  styleUrls: ["./ingestor-renderer.component.scss"],
  templateUrl: "./creation-location-field-renderer.html",
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreationLocationFieldComponent
  extends JsonFormsControl
  implements OnInit, OnDestroy
{
  private componentSubscriptions: Subscription[] = [];
  focused = false;
  status$ = this.store.select(selectIngestorStatus);
  creationLocations: string[] = [];

  constructor(
    jsonformsService: JsonFormsAngularService,
    private store: Store,
  ) {
    super(jsonformsService);
  }

  getEventValue = (event: any) => event.target.value || undefined;

  ngOnInit() {
    super.ngOnInit();

    this.componentSubscriptions.push(
      this.status$.subscribe((status) => {
        this.creationLocations =
          status.configurations?.creationLocations ?? [];

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

export const creationLocationFieldTester: RankedTester = rankWith(
  2.5,
  scopeEndsWith("creationLocation"),
);
