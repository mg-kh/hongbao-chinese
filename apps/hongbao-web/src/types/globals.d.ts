import { TRole } from "./roles";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: TRole;
    };
  }
}
