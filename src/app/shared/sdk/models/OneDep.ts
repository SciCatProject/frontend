export interface OneDepCreated {
  depID: string;
}

export interface OneDepUserInfo {
  email: string;
  orcidIds: string[];
  country: string;
  method: string;
  jwtToken: string;
  password?: string;
}

export interface UploadedFile {
  depID: string;
  FileID: string;
}
