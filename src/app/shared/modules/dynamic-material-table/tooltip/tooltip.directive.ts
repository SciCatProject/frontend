import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  TemplateRef,
  Injector,
  OnDestroy,
} from "@angular/core";
import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { TooltipComponent } from "./tooltip.component";

@Directive({
  selector: "[appTooltip]:not([click-to-open])",
})
export class TooltipDirective implements OnInit, OnDestroy {
  private overlayRef: OverlayRef;
  @Input("appTooltip") content: string | TemplateRef<any>;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
  ) {}

  ngOnDestroy(): void {
    this.hide();
  }

  ngOnInit() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: "center",
          originY: "top",
          overlayX: "center",
          overlayY: "bottom",
          offsetY: -8,
        },
      ]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener("mouseenter")
  show() {
    const injector = Injector.create({
      providers: [{ provide: "tooltipConfig", useValue: this.content }],
    });
    this.overlayRef.attach(
      new ComponentPortal(TooltipComponent, null, injector),
    );
  }

  @HostListener("mouseleave")
  hide() {
    this.overlayRef.detach();
  }
}
