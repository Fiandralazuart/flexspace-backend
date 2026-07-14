import { Request } from "express";

export interface IUserToken {
  id: string;
  roleId: number;
}

export interface IReqUser extends Request {
  user?: IUserToken;
}