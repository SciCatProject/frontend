import { Component, OnInit } from "@angular/core";
import { JsonFormsControl } from "@jsonforms/angular";

@Component({
  selector: "AllOfRenderer",
  styleUrls: ["../ingestor-metadata-editor.component.scss"],
  template: `<div>AllOf Renderer</div>`,
})
export class AllOfRendererComponent extends JsonFormsControl implements OnInit {
  data: any[] = [];

  ngOnInit() {
    this.data = this.uischema?.options?.items || [];
  }
}
