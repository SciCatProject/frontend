/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { UserCredential } from '../../models/UserCredential';
import { UserIdentity } from '../../models/UserIdentity';
import { ApplicationCredential } from '../../models/ApplicationCredential';
import { Logbook } from '../../models/Logbook';
import { PublishedData } from '../../models/PublishedData';
import { Dataset } from '../../models/Dataset';
import { RawDataset } from '../../models/RawDataset';
import { DerivedDataset } from '../../models/DerivedDataset';
import { Sample } from '../../models/Sample';
import { Proposal } from '../../models/Proposal';
import { Datablock } from '../../models/Datablock';
import { Policy } from '../../models/Policy';
import { OrigDatablock } from '../../models/OrigDatablock';
import { Attachment } from '../../models/Attachment';
import { Job } from '../../models/Job';
import { ShareGroup } from '../../models/ShareGroup';
import { UserSetting } from '../../models/UserSetting';
import { Instrument } from '../../models/Instrument';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    UserCredential: UserCredential,
    UserIdentity: UserIdentity,
    ApplicationCredential: ApplicationCredential,
    Logbook: Logbook,
    PublishedData: PublishedData,
    Dataset: Dataset,
    RawDataset: RawDataset,
    DerivedDataset: DerivedDataset,
    Sample: Sample,
    Proposal: Proposal,
    Datablock: Datablock,
    Policy: Policy,
    OrigDatablock: OrigDatablock,
    Attachment: Attachment,
    Job: Job,
    ShareGroup: ShareGroup,
    UserSetting: UserSetting,
    Instrument: Instrument,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
