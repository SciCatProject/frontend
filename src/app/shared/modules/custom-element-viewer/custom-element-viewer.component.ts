import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'custom-element-viewer',
  template: `<div #container></div>`,
  standalone: true,
})
export class CustomElementViewerComponent implements OnChanges, OnDestroy {
  @Input() tagName!: string;
  @Input() scriptUrl!: string;
  @Input() props: Record<string, any> = {};

  @ViewChild('container', { static: true }) containerRef!: ElementRef;

  private customElementInstance?: HTMLElement;
  private scriptElement?: HTMLScriptElement;

  constructor(private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('scriptUrl' in changes && this.scriptUrl) {
      this.loadScript(this.scriptUrl).then(() => {
        this.renderCustomElement();
      });
    } else if ('tagName' in changes && this.tagName) {
      this.renderCustomElement();
    }

    if (this.customElementInstance && 'props' in changes) {
      this.updateProps();
    }
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

  private renderCustomElement() {
    if (!this.tagName || !this.containerRef) return;

    if (this.customElementInstance) {
      this.customElementInstance.remove();
    }

    this.customElementInstance = document.createElement(this.tagName);
    this.containerRef.nativeElement.appendChild(this.customElementInstance);
    this.updateProps();
  }

  private updateProps() {
    if (!this.customElementInstance) return;

    for (const [key, value] of Object.entries(this.props)) {
      (this.customElementInstance as any)[key] = value;
    }
  }
}
