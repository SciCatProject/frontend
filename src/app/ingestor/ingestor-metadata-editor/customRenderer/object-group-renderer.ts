import { ChangeDetectorRef, Component } from "@angular/core";
import {
  JsonFormsAngularService,
  JsonFormsControlWithDetail,
} from "@jsonforms/angular";
import { ControlProps } from "@jsonforms/core";
import {
  configuredRenderer,
  convertJSONFormsErrorToString,
} from "../ingestor-metadata-editor-helper";

@Component({
  selector: "app-object-group-renderer",
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
        <div *ngIf="errorRecursiveStructure === false">
          <jsonforms
            [schema]="scopedSchema"
            [data]="data"
            [renderers]="defaultRenderer"
            (dataChange)="onInnerJsonFormsChange($event)"
            (errors)="onInnerErrors($event)"
          ></jsonforms>
        </div>

        <p *ngIf="errorRecursiveStructure">
          <mat-icon color="warn">error_outline</mat-icon>
          Recursive data structure in selected JSON Schema detected.
        </p>
      </mat-card-content>
    </mat-card>
  `,
})
export class CustomObjectControlRendererComponent extends JsonFormsControlWithDetail {
  rendererService: JsonFormsAngularService;

  defaultRenderer = configuredRenderer;
  objectTitle: string;
  innerErrors: string;
  errorRecursiveStructure: boolean;

  constructor(
    service: JsonFormsAngularService,
    private cdr: ChangeDetectorRef,
  ) {
    super(service);
    this.rendererService = service;
  }

  public mapAdditionalProps(props: ControlProps) {
    const pathTitle = props.path || "Object";

    this.errorRecursiveStructure = this.isRecursive();

    this.objectTitle = pathTitle
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  public onInnerJsonFormsChange(event: any) {
    if (event !== this.data) {
      const updatedData =
        this.rendererService.getState().jsonforms.core.data ?? {};

      // Update the data in the correct path
      const pathSegments = this.path.split(".");
      let current = updatedData ?? {};
      for (let i = 0; i < pathSegments.length - 1; i++) {
        current = current[pathSegments[i]];
      }
      current[pathSegments[pathSegments.length - 1]] = event;

      this.rendererService.setData(updatedData);
    }
  }

  onInnerErrors(errors: any[]) {
    this.innerErrors = convertJSONFormsErrorToString(errors);
    this.cdr.detectChanges();
  }

  isRecursive(): boolean {
    const rootSchemaAsString = JSON.stringify(this.scopedSchema);
    const scopedSchemaAsString = JSON.stringify(this.rootSchema);

    // Check if root and scoped schema are equal and if expected type is object
    if (
      rootSchemaAsString === scopedSchemaAsString &&
      ((Array.isArray(this.scopedSchema.type) &&
        this.scopedSchema.type.includes("object")) ||
        (typeof this.scopedSchema.type === "string" &&
          this.scopedSchema.type === "object"))
    ) {
      return true;
    }

    return false;
  }
}
