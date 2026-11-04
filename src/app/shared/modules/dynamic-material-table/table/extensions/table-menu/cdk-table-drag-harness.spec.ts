import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

@Component({
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  template: `
    <div
      class="table"
      cdkDropList
      cdkDropListOrientation="horizontal"
      (cdkDropListDropped)="drop($event)"
      (cdkDragStarted)="started = started + 1"
    >
      <div class="row">
        @for (item of items; track item; let i = $index) {
          <div
            class="cell"
            cdkDrag
            cdkDragBoundary=".row"
            [cdkDragData]="{ name: item }"
          >
            <span class="drag-indicator" cdkDragHandle>{{ item }}</span>
            <span class="caption">{{ item }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .table {
        display: block;
        width: 100%;
      }
      .row {
        display: flex;
        width: 100%;
      }
      .cell {
        flex: 1 1 0;
        padding: 8px;
        border: 1px solid #ccc;
      }
      .drag-indicator {
        cursor: move;
      }
    `,
  ],
})
class TableHost {
  items = ["PID", "Name", "Run Number", "Size"];
  dropped: CdkDragDrop<any> | null = null;
  started = 0;
  drop(e: CdkDragDrop<any>) {
    this.dropped = e;
    moveItemInArray(this.items, e.previousIndex, e.currentIndex);
  }
}

const defineXY = (event: MouseEvent, x: number, y: number) => {
  Object.defineProperty(event, "pageX", { get: () => x + window.scrollX });
  Object.defineProperty(event, "pageY", { get: () => y + window.scrollY });
};

const dispatchMouse = (target: any, type: string, x: number, y: number) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    view: window,
    button: 0,
    buttons: type === "mouseup" ? 0 : 1,
    detail: type === "mousedown" ? 1 : 0,
    clientX: x,
    clientY: y,
  });
  defineXY(event, x, y);
  target.dispatchEvent(event);
};

const nextTick = () => new Promise((r) => setTimeout(r, 0));

describe("CDK table-like drag harness", () => {
  let fixture: ComponentFixture<TableHost>;
  let host: TableHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TableHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TableHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it("reorders when dragging a cell via its handle", async () => {
    const handles = fixture.nativeElement.querySelectorAll(".drag-indicator");
    const cells = fixture.nativeElement.querySelectorAll(".cell");
    const s = cells[0].getBoundingClientRect();
    const t = cells[2].getBoundingClientRect();
    const sx = s.left + s.width / 2;
    const sy = s.top + s.height / 2;
    const ex = t.left + t.width / 2;
    const ey = t.top + t.height / 2;

    dispatchMouse(handles[0], "mousedown", sx, sy);
    await nextTick();
    dispatchMouse(document, "mousemove", sx + 20, sy + 5);
    await nextTick();
    dispatchMouse(document, "mousemove", ex, ey);
    await nextTick();
    dispatchMouse(document, "mousemove", ex, ey);
    await nextTick();
    dispatchMouse(document, "mouseup", ex, ey);
    await nextTick();
    fixture.detectChanges();

    // eslint-disable-next-line no-console
    console.log(
      "TABLE HARNESS started=",
      host.started,
      "dropped=",
      !!host.dropped,
    );
    expect(host.dropped).not.toBeNull();
    expect(host.dropped!.previousIndex).toBe(0);
    expect(host.dropped!.currentIndex).toBe(2);
  });
});
