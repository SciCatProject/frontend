/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Dataset } from '../../models/Dataset';
import { RawDataset } from '../../models/RawDataset';
import { DerivedDataset } from '../../models/DerivedDataset';
import { Sample } from '../../models/Sample';
import { Proposal } from '../../models/Proposal';
import { DatasetLifecycle } from '../../models/DatasetLifecycle';
import { Datablock } from '../../models/Datablock';
import { AccessUser } from '../../models/AccessUser';
import { AccessGroup } from '../../models/AccessGroup';
import { SynchTimes } from '../../models/SynchTimes';
import { UserCredential } from '../../models/UserCredential';
import { UserIdentity } from '../../models/UserIdentity';
import { ApplicationCredential } from '../../models/ApplicationCredential';
import { Policy } from '../../models/Policy';
import { Job } from '../../models/Job';
import { OrigDatablock } from '../../models/OrigDatablock';
import { RabbitMQ } from '../../models/RabbitMQ';

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
    DatasetLifecycle: DatasetLifecycle,
    Datablock: Datablock,
    AccessUser: AccessUser,
    AccessGroup: AccessGroup,
    SynchTimes: SynchTimes,
    UserCredential: UserCredential,
    UserIdentity: UserIdentity,
    ApplicationCredential: ApplicationCredential,
    Policy: Policy,
    Job: Job,
    OrigDatablock: OrigDatablock,
    RabbitMQ: RabbitMQ,
    
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
