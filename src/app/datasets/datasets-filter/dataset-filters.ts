
export interface DatasetFilters {
    text: string;
    ownerGroup: string[];
    type: string;
    creationTime: {'start': Date, 'end': Date};
    creationLocation: string[];
    skip: number;
    initial: boolean;
}

