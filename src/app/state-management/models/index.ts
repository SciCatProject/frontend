import { User, AccessGroup, Job, RawDataset } from 'shared/sdk/models';

export interface Settings {
  tapeCopies: string;
  datasetCount: number;
  jobCount: number;
  darkTheme: false;
};

export enum MessageType {
	Success = 'success',
	Error = 'error',
};

export interface Message {
  content: string;
  title: string;
  type: MessageType;
};

export { User, AccessGroup, Job, RawDataset };