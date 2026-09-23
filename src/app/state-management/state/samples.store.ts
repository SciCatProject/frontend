import {
  OutputAttachmentV3Dto,
  OutputDatasetObsoleteDto,
  OutputSampleDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { SampleFilters, GenericFilters } from "state-management/models";

export interface SampleState {
  samples: OutputSampleDto[];
  attachments: OutputAttachmentV3Dto[];
  currentSample: OutputSampleDto | undefined;
  datasets: OutputDatasetObsoleteDto[];
  metadataKeys: string[];

  samplesCount: number;
  samplesCountIsLoading: boolean;
  datasetsCount: number;
  datasetsCountIsLoading: boolean;

  hasPrefilledFilters: boolean;
  sampleFilters: SampleFilters;

  datasetFilters: GenericFilters;
}

export const initialSampleState: SampleState = {
  samples: [],
  attachments: [],
  currentSample: undefined,
  datasets: [],
  metadataKeys: [],

  samplesCount: 0,
  samplesCountIsLoading: false,
  datasetsCount: 0,
  datasetsCountIsLoading: false,

  hasPrefilledFilters: false,

  sampleFilters: {
    text: "",
    sortField: "createdAt:desc",
    skip: 0,
    limit: 25,
    characteristics: [],
  },

  datasetFilters: {
    sortField: "createdAt:desc",
    skip: 0,
    limit: 25,
  },
};
