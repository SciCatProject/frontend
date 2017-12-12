
export interface DatasetFilters {
    text: string;
    ownerGroup: string[];
    creationTime: {'start': Date, 'end': Date};
    creationLocation: string[];
    skip: number;
    initial: boolean;
}

