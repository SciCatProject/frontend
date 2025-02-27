import { Subject } from "rxjs";

export class ResizeColumn {
  startX: number;
  startWidth: number;
  columnIndex: number;
  resizeHandler?: "left" | "right" = null;
  public widthUpdate: Subject<{ e: ResizeColumn; w: number }> = new Subject<{
    e: ResizeColumn;
    w: number;
  }>();
}
