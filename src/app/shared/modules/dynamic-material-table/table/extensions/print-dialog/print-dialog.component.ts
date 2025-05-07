import { Component, ViewChild, ElementRef, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PrintConfig } from "../../../models/print-config.model";

const styles =
  "body{margin:15px;}table{width:100%;border-collapse:collapse;}h2{text-align:center;}th.mat-mdc-header-cell{text-align:center;}div{text-align:center;margin:30px }tr{border-bottom:1px solid }td,th{padding:10px; text-align: center }.param-list{text-align: left;border:solid gray;border-width: 0px 0px 2px 0;margin-bottom: 10px;padding-bottom: 10px;}.param {display: inline-block;margin: 10px;}";

@Component({
  selector: "print-dialog",
  templateUrl: "./print-dialog.component.html",
  styleUrls: ["./print-dialog.component.scss"],
  standalone: false,
})
export class PrintTableDialogComponent {
  @ViewChild("printContentRef", { static: true }) printContentRef!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<PrintTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public printTable: PrintConfig,
  ) {}

  print() {
    const dialogConfig =
      "width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no";
    const printDoc = `
    <html>
      <head>
        <style> ${styles} </style>
      </head>
      <body onload="window.print();" onafterprint="window.close()">
        ${this.printContentRef.nativeElement.innerHTML}
      </body>
    </html>
    `;

    const popupWinindow = window.open("", "_blank", dialogConfig);
    popupWinindow.document.write(printDoc);
    popupWinindow.document.close();
  }
}
