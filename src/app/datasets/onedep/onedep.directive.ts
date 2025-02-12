import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({ selector: "[orcidFormatter]" })
export class OrcidFormatterDirective {
  private readonly maxRawLength = 16;

  constructor(private el: ElementRef) {}

  private formatWithDashes(value: string): string {
    return value.match(/.{1,4}/g)?.join("-") || value;
  }

  private getAdjustedCursorPosition(
    rawValue: string,
    originalPosition: number,
  ): number {
    const rawCursorPosition = rawValue.slice(0, originalPosition).length;
    const dashCountBeforeCursor = Math.floor(rawCursorPosition / 4);
    return rawCursorPosition + dashCountBeforeCursor;
  }

  private calculateCursorAdjustment(
    previousValue: string,
    newValue: string,
    cursorPosition: number,
  ): number {
    const removedChar = previousValue.length > newValue.length;
    const addedDash = newValue.charAt(cursorPosition - 1) === "-";
    if (removedChar && addedDash) {
      return -1;
    }
    if (addedDash) {
      return +1;
    }

    return 0;
  }
  @HostListener("input", ["$event"])
  onInput(event: InputEvent): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;

    const rawValue = inputElement.value
      .replace(/-/g, "")
      .slice(0, this.maxRawLength);

    const formattedValue = this.formatWithDashes(rawValue);

    // Calculate the new cursor position
    const previousValue = inputElement.value;
    const previousCursorPosition = inputElement.selectionStart || 0;
    const adjustment = this.calculateCursorAdjustment(
      previousValue,
      formattedValue,
      previousCursorPosition,
    );

    // Update the input's visible value
    inputElement.value = formattedValue;

    // Set the cursor to the adjusted position
    const cursorPosition = previousCursorPosition + adjustment;
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
  }
}
