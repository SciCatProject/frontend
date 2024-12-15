import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps, JsonSchema } from '@jsonforms/core';
import { configuredRenderer } from '../ingestor-metadata-editor-helper';

@Component({
    selector: 'app-anyof-renderer',
    template: `
    <div class="anyof-group">
    <mat-card-title>{{anyOfTitle}}</mat-card-title>

    <mat-tab-group animationDuration="0ms" [selectedIndex]="selectedTabIndex">
        <mat-tab *ngFor="let option of options" label="{{option}}">
            <div style="margin: 20px auto; width: 85%" *ngIf="option !== 'null'">
                <jsonforms [schema]="getTabSchema(option)" [data]="passedProps.data" [renderers]="defaultRenderer" (dataChange)=onInnerJsonFormsChange($event)></jsonforms>
            </div>
        </mat-tab>
    </mat-tab-group>
    </div>
  `
})
export class AnyOfRenderer extends JsonFormsControl {

    dataAsString: string;
    options: string[] = [];
    anyOfTitle: string;
    selectedTabIndex: number = 0; // default value 

    rendererService: JsonFormsAngularService;

    defaultRenderer = configuredRenderer;
    passedProps: ControlProps;

    constructor(service: JsonFormsAngularService) {
        super(service);
        this.rendererService = service;
    }

    public mapAdditionalProps(props: ControlProps) {
        this.passedProps = props;
        this.anyOfTitle = props.label || 'AnyOf';
        this.options = props.schema.anyOf.map((option: any) => option.title || option.type || JSON.stringify(option));
    
        if (this.options.includes("null") && !props.data) {
            this.selectedTabIndex = this.options.indexOf("null");
        }
    }

    public getTabSchema(tabOption: string): JsonSchema {
        const selectedSchema = (this.passedProps.schema.anyOf as any).find((option: any) => option.title === tabOption || option.type === tabOption || JSON.stringify(option) === tabOption);
        return selectedSchema;
    }

    public onInnerJsonFormsChange(event: any) {
        // Check if data is equal to the passedProps.data
        if (event !== this.passedProps.data) {
            const updatedData = this.rendererService.getState().jsonforms.core.data;

            // aktualisiere das aktuelle Datenobjekt
            const pathSegments = this.passedProps.path.split('.');
            let current = updatedData;
            for (let i = 0; i < pathSegments.length - 1; i++) {
                current = current[pathSegments[i]];
            }
            current[pathSegments[pathSegments.length - 1]] = event;

            this.rendererService.setData(updatedData);
        }
    }
}