import { Directive, HostListener, ElementRef, OnInit } from "@angular/core";

@Directive({ selector: "[orcidFormatter]" })
export class OrcidFormatterDirective {

  private readonly maxRawLength = 16;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;

    // Remove all existing dashes and limit to the max length
    const rawValue = inputElement.value.replace(/-/g, '').slice(0, this.maxRawLength);

    // Format with dashes
    const formattedValue = this.formatWithDashes(rawValue);

    // Update the input's visible value
    inputElement.value = formattedValue;

    // Preserve the cursor position
    const cursorPosition = this.getAdjustedCursorPosition(rawValue, inputElement.selectionStart || 0);
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
  }

  private formatWithDashes(value: string): string {
    return value.match(/.{1,4}/g)?.join('-') || value;
  }

  private getAdjustedCursorPosition(rawValue: string, originalPosition: number): number {
    const rawCursorPosition = rawValue.slice(0, originalPosition).length;
    const dashCountBeforeCursor = Math.floor(rawCursorPosition / 4);
    return rawCursorPosition + dashCountBeforeCursor;
  }

}