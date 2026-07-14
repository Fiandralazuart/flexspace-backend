import { JWT_SECRET } from "./env"
import jwt from "jsonwebtoken"


interface ActivationTokenPayload {
  id: string;
  email: string;
}

export const createActivationToken = (
  payload: ActivationTokenPayload
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyActivationToken = (token: string): ActivationTokenPayload => {
    return jwt.verify(token, JWT_SECRET) as ActivationTokenPayload;
};