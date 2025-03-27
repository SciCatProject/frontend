import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appTemplateOrString]",
})
export class TemplateOrStringDirective {
  @Input() set templateOrString(content: string | TemplateRef<any>) {
    const template = content instanceof TemplateRef ? content : this.defaultTpl;
    this.vcr.clear();
    this.vcr.createEmbeddedView(template);
  }

  constructor(
    private defaultTpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
  ) {}
}
