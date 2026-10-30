import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

@Component({
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  template: `
    <div class="list" cdkDropList (cdkDropListDropped)="drop($event)">
      @for (item of items; track item; let i = $index) {
        <div
          class="item"
          cdkDrag
          [cdkDragData]="item"
          (cdkDragStarted)="started = started + 1"
        >
          <span class="handle" cdkDragHandle>{{ item }} handle</span>
        </div>
      }
    </div>
  `,
})
class TestHost {
  items = ["A", "B", "C", "D"];
  dropped: CdkDragDrop<string[]> | null = null;
  started = 0;
  drop(e: CdkDragDrop<string[]>) {
    this.dropped = e;
    moveItemInArray(this.items, e.previousIndex, e.currentIndex);
  }
}

const defineXY = (event: MouseEvent, x: number, y: number) => {
  Object.defineProperty(event, "pageX", { get: () => x + window.scrollX });
  Object.defineProperty(event, "pageY", { get: () => y + window.scrollY });
};

const dispatchMouse = (
  target: any,
  type: string,
  x: number,
  y: number,
  detail: number,
) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    view: window,
    button: 0,
    buttons: type === "mouseup" ? 0 : 1,
    detail,
    clientX: x,
    clientY: y,
  });
  defineXY(event, x, y);
  target.dispatchEvent(event);
};

const nextTick = () => new Promise((r) => setTimeout(r, 0));

describe("CDK drag harness", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  async function drag(from: number, to: number, detail: number) {
    const handles = fixture.nativeElement.querySelectorAll(".handle");
    const items = fixture.nativeElement.querySelectorAll(".item");
    const s = items[from].getBoundingClientRect();
    const t = items[to].getBoundingClientRect();
    const sx = s.left + s.width / 2;
    const sy = s.top + s.height / 2;
    const ex = t.left + t.width / 2;
    const ey = t.top + t.height / 2;

    dispatchMouse(handles[from], "mousedown", sx, sy, detail);
    await nextTick();
    dispatchMouse(document, "mousemove", sx + 20, sy + 5, 0);
    await nextTick();
    dispatchMouse(document, "mousemove", ex, ey, 0);
    await nextTick();
    dispatchMouse(document, "mousemove", ex, ey, 0);
    await nextTick();
    dispatchMouse(document, "mouseup", ex, ey, 0);
    await nextTick();
  }

  it("detail=0 mousedown does not trigger drop", async () => {
    await drag(0, 2, 0);
    fixture.detectChanges();
    expect(host.started).toBe(0);
    expect(host.dropped).toBeNull();
  });

  it("detail=1 mousedown triggers the drop", async () => {
    await drag(0, 2, 1);
    fixture.detectChanges();
    // eslint-disable-next-line no-console
    console.log("HARNESS started=", host.started, "dropped=", !!host.dropped);
    expect(host.started).toBeGreaterThan(0);
    expect(host.dropped).not.toBeNull();
    expect(host.dropped!.currentIndex).toBe(2);
  });
});
