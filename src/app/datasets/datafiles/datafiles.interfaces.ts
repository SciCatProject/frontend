export interface DataFile {
  path: string;
  size: number;
  time: string;
  chk?: string;
  uid?: string;
  gid?: string;
  perm?: string;
  hash?: string;
  metadata?: string;
  selected: boolean;
}
