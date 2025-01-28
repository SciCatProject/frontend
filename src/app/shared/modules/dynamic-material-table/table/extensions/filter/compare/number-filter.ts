import { AbstractFilter, FilterOperation } from "./abstract-filter";

const equals = "a === b";
const notEquals = "a !== b";
const greaterThan = "a > b";
const lessThan = "a < b";
const empty = "!a";
const notEmpty = "!!a";
const operations = [equals, notEquals, greaterThan, lessThan, empty, notEmpty];

export class NumberFilter extends AbstractFilter<number> {
  private static sql = ["=", "<>", ">", "<", "IS NULL", "IS NOT NULL"];
  private static operationList: FilterOperation[] = [];
  private _selectedIndex: number = null;

  constructor() {
    super();
    if (NumberFilter.operationList.length === 0) {
      operations.forEach((fn) => {
        NumberFilter.operationList.push({ predicate: fn, text: null });
      });
    }
    NumberFilter.operationList[0].text = "equals"; // equals //
    NumberFilter.operationList[1].text = "notEquals"; // notEquals //
    NumberFilter.operationList[2].text = "greaterThan"; // greaterThan //
    NumberFilter.operationList[3].text = "lessThan"; // lessThan //
    NumberFilter.operationList[4].text = "empty"; // empty //
    NumberFilter.operationList[5].text = "notEmpty"; // notEmpty //
  }

  get selectedIndex(): number {
    return this._selectedIndex;
  }
  set selectedIndex(value: number) {
    this._selectedIndex = value;
    // init filter parameters
    if (value === 0 || value === 1 || value === 2 || value === 3) {
      // equals notEquals greaterThan lessThan
      this.parameters = [{ value: null, text: "number" }];
    } else {
      // empty notEmpty
      this.parameters = null;
    }
  }

  get selectedValue(): FilterOperation {
    if (this._selectedIndex !== null) {
      return NumberFilter.operationList[this._selectedIndex];
    } else {
      return null;
    }
  }

  public getOperations(): FilterOperation[] {
    return NumberFilter.operationList;
  }

  public toString(dynamicVariable: any): string {
    const a = "_a$";
    const b = "_b$";
    const predicate = this.selectedValue.predicate
      .replace("a", a)
      .replace("b", b);
    const statement = predicate.replace(a, `${a}['${dynamicVariable}']`);
    // one static variable (equals, notEquals,greaterThan,lessThan)
    if (
      this._selectedIndex === 0 ||
      this._selectedIndex === 1 ||
      this._selectedIndex === 2 ||
      this._selectedIndex === 3
    ) {
      const value = this.parameters[0].value
        ? this.parameters[0].value.toString()
        : " null ";
      return statement.replace(b, value);
    } else {
      // none static variable (empty, notEmpty)
      return statement;
    }
  }

  public toPrint(): string {
    return (
      NumberFilter.operationList[this._selectedIndex].text +
      " " +
      this.parameters[0].value +
      " " +
      (this.type || "") +
      " "
    );
  }

  public toSql(): string {
    return (
      NumberFilter.sql[this._selectedIndex] +
      " " +
      (this.parameters[0].value || "") +
      " " +
      (this.type || "") +
      " "
    );
  }
}
