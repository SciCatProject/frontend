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

export class Message {
  content: string;
  type: MessageType;
  // These are only used very sporadically in the code.
  // Maybe they're obsolete and should be removed?
  title?: string = '';
  timeout?: number = 0;
  class?: string = '';
};

export { User, AccessGroup, Job, RawDataset };