import { EventEmitter } from "@angular/core";
interface Actions {
  undo: () => void;
  redo: () => void;
}
export class HistoryManager {
  commands: Actions[] = [];
  indexChanged = new EventEmitter<number>();
  currentIdx = -1;
  limit = 0;
  private execute(command: Actions, actionName: string) {
    command[actionName]();
  }
  add(command: Actions) {
    this.commands.splice(
      this.currentIdx + 1,
      this.commands.length - this.currentIdx,
    );
    this.commands.push(command);
    this.currentIdx = this.commands.length - 1;
    this.indexChanged.emit(this.currentIdx);
  }
  undo() {
    const command = this.commands[this.currentIdx];
    if (command) {
      this.execute(command, "undo");
    }
    this.currentIdx -= 1;
    this.indexChanged.emit(this.currentIdx);
  }
  redo() {
    const command = this.commands[this.currentIdx + 1];
    if (command) {
      this.execute(command, "redo");
    }
    this.currentIdx += 1;
    this.indexChanged.emit(this.currentIdx);
  }
  hasUndo() {
    return this.currentIdx > -1;
  }
  hasRedo() {
    return this.currentIdx < this.commands.length - 1;
  }
  setLimit(limit: number): void {
    this.limit = limit;
  }
  clearHistory() {
    this.commands = [];
    this.currentIdx = -1;
  }
}
