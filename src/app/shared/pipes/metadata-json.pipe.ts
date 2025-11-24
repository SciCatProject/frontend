import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metadataJson',
  standalone: false
})
export class MetadataJsonPipe implements PipeTransform {

  transform(value: any): string {
    return this.formatObject(value, 0);
  }

  private formatObject(obj: any, indent: number): string {
    if (obj == null || typeof obj !== 'object') {
      return this.indent(indent) + String(obj);
    }

    // Case: object with { value, unit }
    if ('value' in obj && 'unit' in obj) {
      const display = `${obj.value} ${obj.unit}`.trim();
      return this.indent(indent) + display;
    }

    // Generic nested object
    let result = '';
    for (const key of Object.keys(obj)) {
      const val = obj[key];

      if (this.isValueUnitObject(val)) {
        // Print inline: key: value unit
        result += `${this.indent(indent)}${key}: ${val.value} ${val.unit}\n`;
      } else if (typeof val === 'object' && val !== null) {
        // Nested block
        result += `${this.indent(indent)}${key}:\n`;
        result += this.formatObject(val, indent + 2) + '\n';
      } else {
        // Primitive value
        result += `${this.indent(indent)}${key}: ${val}\n`;
      }
    }

    return result.trimEnd();
  }

  private isValueUnitObject(obj: any): boolean {
    return (
      obj &&
      typeof obj === 'object' &&
      'value' in obj &&
      'unit' in obj
    );
  }
  
  private indent(n: number): string {
    return ' '.repeat(n);
  }
}
