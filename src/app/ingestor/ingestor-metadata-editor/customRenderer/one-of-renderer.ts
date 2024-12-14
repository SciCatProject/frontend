import { Component } from '@angular/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'OneOfRenderer',
  template: `<div>OneOf Renderer</div>`
})
export class OneOfRenderer extends JsonFormsControl {
  data: any[] = [];

  ngOnInit() {
    this.data = this.uischema?.options?.items || [];
  }
}
