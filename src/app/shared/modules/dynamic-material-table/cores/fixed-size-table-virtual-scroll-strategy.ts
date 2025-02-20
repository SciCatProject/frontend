import { Injectable, OnDestroy } from "@angular/core";
import { distinctUntilChanged } from "rxjs/operators";
import { BehaviorSubject, Subject } from "rxjs";
import {
  CdkVirtualScrollViewport,
  VirtualScrollStrategy,
} from "@angular/cdk/scrolling";
import { ListRange } from "@angular/cdk/collections";
import { Subscription } from "rxjs";

export interface TSVStrategyConfigs {
  rowHeight: number;
  headerHeight: number;
  footerHeight: number;
  bufferMultiplier: number;
}

export declare type TableScrollStrategy = "fixed-size" | "none" | null;

@Injectable()
export class FixedSizeTableVirtualScrollStrategy
  implements VirtualScrollStrategy, OnDestroy
{
  private eventsSubscription: Subscription;
  private length = 0;
  private rowHeight!: number;
  private headerHeight!: number;
  private footerHeight!: number;
  private bufferMultiplier!: number;
  private indexChange = new Subject<number>();
  public stickyChange = new Subject<number>();
  public scrollStrategyMode: TableScrollStrategy = "fixed-size";

  public viewport: CdkVirtualScrollViewport;

  public renderedRangeStream = new BehaviorSubject<ListRange>({
    start: 0,
    end: 0,
  });
  public offsetChange = new BehaviorSubject(0);

  public scrolledIndexChange = this.indexChange.pipe(distinctUntilChanged());

  private updateContent() {
    if (!this.viewport || !this.rowHeight) {
      return;
    }
    let start = 0;
    let end = this.dataLength;

    if (
      this.scrollStrategyMode === "none" &&
      this.viewport.getRenderedRange().start === start &&
      this.viewport.getRenderedRange().end === end
    ) {
      return;
    }

    const scrollOffset = this.viewport.measureScrollOffset();
    const amount = Math.ceil(this.getViewportSize() / this.rowHeight);
    const offset = Math.max(scrollOffset - this.headerHeight, 0);
    const buffer = Math.ceil(amount * this.bufferMultiplier);

    const skip = Math.round(offset / this.rowHeight);
    const index = Math.max(0, skip);

    if (this.scrollStrategyMode === "fixed-size") {
      start = Math.max(0, index - buffer);
      end = Math.min(this.dataLength, index + amount + buffer);
    }
    const renderedOffset = start * this.rowHeight;

    this.viewport.setRenderedContentOffset(renderedOffset);
    this.viewport.setRenderedRange({ start, end });
    this.indexChange.next(index);
    this.stickyChange.next(renderedOffset);
    this.offsetChange.next(offset);
  }

  get dataLength(): number {
    return this.length;
  }

  set dataLength(value: number) {
    this.length = value;
    this.onDataLengthChanged();
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  public attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.eventsSubscription = this.viewport.renderedRangeStream.subscribe(
      this.renderedRangeStream,
    );
    this.onDataLengthChanged();
  }

  public detach(): void {
    this.indexChange.complete();
    this.stickyChange.complete();
    this.renderedRangeStream.complete();
  }

  public onContentScrolled(): void {
    this.updateContent();
  }

  public onDataLengthChanged(): void {
    if (this.viewport) {
      this.viewport.setTotalContentSize(
        this.dataLength * this.rowHeight +
          this.headerHeight +
          this.footerHeight,
      );
    }
    this.updateContent();
  }

  public onContentRendered(): void {
    // no-op
  }

  public onRenderedOffsetChanged(): void {
    // no-op
  }

  public scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (!this.viewport || !this.rowHeight) {
      return;
    }
    this.viewport.scrollToOffset(
      (index - 1) * this.rowHeight + this.headerHeight,
    );
  }

  public setConfig(configs: TSVStrategyConfigs) {
    const { rowHeight, headerHeight, footerHeight, bufferMultiplier } = configs;
    if (
      this.rowHeight === rowHeight &&
      this.headerHeight === headerHeight &&
      this.footerHeight === footerHeight &&
      this.bufferMultiplier === bufferMultiplier
    ) {
      return;
    }
    this.rowHeight = rowHeight;
    this.headerHeight = headerHeight;
    this.footerHeight = footerHeight;
    this.bufferMultiplier = bufferMultiplier;
    this.onDataLengthChanged();
  }

  // bug fixed some time viewport is zero height (i dont know why!)
  public getViewportSize() {
    if (this.viewport.getViewportSize() === 0) {
      return this.viewport.elementRef.nativeElement.clientHeight + 52;
    } else {
      return this.viewport.getViewportSize();
    }
  }
}
