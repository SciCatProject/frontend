import { EmFile } from "../../../datasets/onedep/types/methods.enum";

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
  fileID: string;
}

export interface FileUpload {
  form: FormData;
  fileType: EmFile;
}
