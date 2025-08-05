import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'custom-element-viewer',
  template: `<div #container></div>`,
  standalone: true,
})
export class CustomElementViewerComponent implements AfterViewInit, OnDestroy {
  @Input() tagName!: string;
  @Input() scriptUrl!: string;
  @Input() props: Record<string, any> = {};

  @ViewChild('container', { static: true }) containerRef!: ElementRef;

  private customElementInstance?: HTMLElement;
  private scriptElement?: HTMLScriptElement;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.loadScript(this.scriptUrl).then(() => {
      console.log(this.props)
      this.renderCustomElement();
    });
  }

  ngOnDestroy(): void {
    this.customElementInstance?.remove();
    if (this.scriptElement) {
      this.scriptElement.remove();
      this.scriptElement = undefined;
    }
  }

  private async loadScript(src: string): Promise<void> {
    if (document.querySelector(`script[src="${src}"]`)) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      this.scriptElement = this.renderer.createElement('script');
      this.scriptElement.type = 'text/javascript';
      this.scriptElement.src = src;
      this.scriptElement.onload = () => resolve();
      this.scriptElement.onerror = () =>
        reject(new Error(`Failed to load script: ${src}`));
      this.renderer.appendChild(document.body, this.scriptElement);
    });
  }

  private async renderCustomElement() {
    if (!this.tagName || !this.containerRef) return;
    await customElements.whenDefined(this.tagName);

    this.customElementInstance = document.createElement(this.tagName);

    for (const [key, value] of Object.entries(this.props)) {
      (this.customElementInstance as any)[key] = value;
    }

    this.containerRef.nativeElement.appendChild(this.customElementInstance);
  }
}
