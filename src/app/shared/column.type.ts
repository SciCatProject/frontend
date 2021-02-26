export interface Column {
    id: string;
    type?: string;
    visible?: boolean;
    label: string;
    hideOrder: number;
    width?: number;
    canSort?: boolean;
    matchMode?: string;
    format?: string;
    icon?: string;
}
