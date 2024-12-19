import { Component } from '@angular/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'AllOfRenderer',
  template: `<div>AllOf Renderer</div>`
})
export class AllOfRenderer extends JsonFormsControl {
  data: any[] = [];

  ngOnInit() {
    this.data = this.uischema?.options?.items || [];
  }
}
