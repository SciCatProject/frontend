/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Dataset } from '../../models/Dataset';
import { RawDataset } from '../../models/RawDataset';
import { DerivedDataset } from '../../models/DerivedDataset';
import { Sample } from '../../models/Sample';
import { Proposal } from '../../models/Proposal';
import { PublishedData } from '../../models/PublishedData';
import { Datablock } from '../../models/Datablock';
import { AccessUser } from '../../models/AccessUser';
import { AccessGroup } from '../../models/AccessGroup';
import { UserCredential } from '../../models/UserCredential';
import { UserIdentity } from '../../models/UserIdentity';
import { ApplicationCredential } from '../../models/ApplicationCredential';
import { Policy } from '../../models/Policy';
import { Job } from '../../models/Job';
import { DatasetAttachment } from '../../models/DatasetAttachment';
import { OrigDatablock } from '../../models/OrigDatablock';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Dataset: Dataset,
    RawDataset: RawDataset,
    DerivedDataset: DerivedDataset,
    Sample: Sample,
    Proposal: Proposal,
    PublishedData: PublishedData,
    Datablock: Datablock,
    AccessUser: AccessUser,
    AccessGroup: AccessGroup,
    UserCredential: UserCredential,
    UserIdentity: UserIdentity,
    ApplicationCredential: ApplicationCredential,
    Policy: Policy,
    Job: Job,
    DatasetAttachment: DatasetAttachment,
    OrigDatablock: OrigDatablock,
    
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
