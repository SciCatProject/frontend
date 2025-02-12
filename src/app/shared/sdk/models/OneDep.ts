import { EmFile } from "../../../datasets/onedep/types/methods.enum";

export interface DepBackendVersion {
  version: string;
}

export interface OneDepCreated {
  email: string;
  id: string;
  pdb_id: string;
  emdb_id: string;
  bmrb_id: string;
  title: string;
  hold_exp_date: string;
  created: string;
  last_login: string;
  site: string;
  site_url: string;
  // Status: Status;
  experiments: any;
  // Errors      :OneDepError
  code: string;
  message: string;
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
