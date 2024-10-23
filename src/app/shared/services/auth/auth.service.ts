/* eslint-disable */
declare var Object: any;
import { Injectable, Inject } from "@angular/core";
import { InternalStorage } from "./base.storage";
import { Configuration } from "shared/sdk";

export interface AccessTokenInterface {
  id?: string;
  ttl?: number;
  scopes?: ["string"];
  created?: Date;
  userId?: string;
  user?: any;
}

export class SDKToken implements AccessTokenInterface {
  id: any = null;
  ttl: number = null;
  scopes: any = null;
  created: any = null;
  userId: any = null;
  user: any = null;
  rememberMe: boolean = null;
  constructor(data?: AccessTokenInterface) {
    Object.assign(this, data);
  }
}

@Injectable()
export class AuthService {
  private token: SDKToken = new SDKToken();

  protected prefix: string = "";

  constructor(@Inject(InternalStorage) protected storage: InternalStorage) {
    this.token.id = this.load("id");
    this.token.user = this.load("user");
    this.token.userId = this.load("userId");
    this.token.created = this.load("created");
    this.token.ttl = this.load("ttl");
    this.token.rememberMe = this.load("rememberMe");
  }

  public setRememberMe(value: boolean): void {
    this.token.rememberMe = value;
  }

  public setUser(user: any) {
    this.token.user = user;
    this.save();
  }

  public setToken(token: SDKToken): void {
    this.token = Object.assign({}, this.token, token);
    this.save();
  }

  public getToken(): SDKToken {
    return <SDKToken>this.token;
  }

  public getAccessTokenId(): string {
    return this.token.id;
  }

  public getCurrentUserId(): any {
    return this.token.userId;
  }

  public getCurrentUserData(): any {
    return typeof this.token.user === "string"
      ? JSON.parse(this.token.user)
      : this.token.user;
  }

  public isAuthenticated() {
    return !(
      this.getCurrentUserId() === "" ||
      this.getCurrentUserId() == null ||
      this.getCurrentUserId() == "null"
    );
  }

  public save(): boolean {
    let today = new Date();
    let expires = new Date(today.getTime() + this.token.ttl * 1000);
    this.persist("id", this.token.id, expires);
    this.persist("user", this.token.user, expires);
    this.persist("userId", this.token.userId, expires);
    this.persist("created", this.token.created, expires);
    this.persist("ttl", this.token.ttl, expires);
    this.persist("rememberMe", this.token.rememberMe, expires);
    return true;
  }

  protected load(prop: string): any {
    return decodeURIComponent(this.storage.get(`${this.prefix}${prop}`));
  }

  public clear(): void {
    Object.keys(this.token).forEach((prop: string) =>
      this.storage.remove(`${this.prefix}${prop}`),
    );
    this.token = new SDKToken();
  }

  protected persist(prop: string, value: any, expires?: Date): void {
    try {
      this.storage.set(
        `${this.prefix}${prop}`,
        typeof value === "object" ? JSON.stringify(value) : value,
        this.token.rememberMe ? expires : null,
      );
    } catch (err) {
      console.error("Cannot access local/session storage:", err);
    }
  }
}
