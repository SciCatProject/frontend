import { ChangeDetectorRef, Component } from "@angular/core";
import {
  JsonFormsAngularService,
  JsonFormsControlWithDetail,
} from "@jsonforms/angular";
import { ControlProps } from "@jsonforms/core";
import { configuredRenderer } from "../ingestor-metadata-editor-helper";

@Component({
  selector: "app-objec==t-group-renderer",
  styleUrls: ["../ingestor-metadata-editor.component.scss"],
  template: `
    <mat-card class="anyof-group">
      <mat-card-title
        >{{ objectTitle }}
        <span class="spacer"></span>
        <mat-icon
          *ngIf="this.innerErrors?.length"
          color="warn"
          matBadgeColor="warn"
          matTooltip="{{ this.innerErrors }}"
          matTooltipClass="error-message-tooltip"
        >
          error_outline
        </mat-icon>
      </mat-card-title>
      <mat-card-content>
        <jsonforms
          [schema]="passedProps.schema"
          [data]="passedProps.data"
          [renderers]="defaultRenderer"
          (dataChange)="onInnerJsonFormsChange($event)"
          (errors)="onInnerErrors($event)"
        ></jsonforms>
      </mat-card-content>
    </mat-card>
  `,
})
export class CustomObjectControlRendererComponent extends JsonFormsControlWithDetail {
  rendererService: JsonFormsAngularService;

  defaultRenderer = configuredRenderer;
  passedProps: ControlProps;
  objectTitle: string;
  innerErrors: string;

  constructor(
    service: JsonFormsAngularService,
    private cdr: ChangeDetectorRef,
  ) {
    super(service);
    this.rendererService = service;
  }

  public mapAdditionalProps(props: ControlProps) {
    this.passedProps = props;
    const pathTitle = props.path || "Object";

    this.objectTitle = pathTitle
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  public onInnerJsonFormsChange(event: any) {
    if (event !== this.passedProps.data) {
      const updatedData =
        this.rendererService.getState().jsonforms.core.data ?? {};

      // Update the data in the correct path
      const pathSegments = this.passedProps.path.split(".");
      let current = updatedData ?? {};
      for (let i = 0; i < pathSegments.length - 1; i++) {
        current = current[pathSegments[i]];
      }
      current[pathSegments[pathSegments.length - 1]] = event;

      this.rendererService.setData(updatedData);
    }
  }

  onInnerErrors(errors: any[]) {
    this.innerErrors = "";
    errors.forEach((error, number) => {
      if (error.message) {
        const ctrNum = number + 1;
        this.innerErrors += ctrNum + ": " + error.message + "\n";
      }
    });
    this.cdr.detectChanges();
  }
}
