export interface FooterCell {
  aggregateText?: string /* The title of the aggregate text */;
  aggregateIcon?: string /* Set Icon in Column */;
  aggregateIconColor?: string /* Set Icon Color */;
  footerClass?: string /* Apply a class to a cell, class name must be in the global stylesheet */;
  footerStyle?: any /* Apply a style to a cell, style must be object ex: [...].cellStyle = {'color' : 'red'} */;
  printable?: boolean /* disply in printing view by defualt is true */;
  exportable?: boolean;
}
