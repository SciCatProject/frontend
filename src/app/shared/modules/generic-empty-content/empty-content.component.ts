import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-empty-content",
  templateUrl: "./empty-content.component.html",
  styleUrls: ["./empty-content.component.scss"],
})
export class EmptyContentComponent {
  @Input() message = "No data available";
  @Input() icon = "info";
  @Input() showReload = false;
  @Input() actionButtons: { icon: string; label: string; color?: string }[] =
    [];

  @Output() reload = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<number>();

  onReload(): void {
    this.reload.emit();
  }

  onActionClick(index: number): void {
    this.actionClick.emit(index);
  }
}
