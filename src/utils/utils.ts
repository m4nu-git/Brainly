import { randomBytes } from "crypto";

export function random(len: number): string {
  return randomBytes(Math.ceil(len / 2)).toString("hex").slice(0, len);
}
