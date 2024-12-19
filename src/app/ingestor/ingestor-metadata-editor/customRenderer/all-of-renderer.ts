import { Component, OnInit } from "@angular/core";
import { JsonFormsControl } from "@jsonforms/angular";

@Component({
  selector: "AllOfRenderer",
  template: `<div>AllOf Renderer</div>`,
})
export class AllOfRendererComponent extends JsonFormsControl implements OnInit {
  data: any[] = [];

  ngOnInit() {
    this.data = this.uischema?.options?.items || [];
  }
}
