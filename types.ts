export type KeyType = "public" | "secret";

export type ModulusValue = 73043 | 97 | 3557 | 13;

export type KeyOptions = {
  modNumber: ModulusValue,
  errorVector: number[],
  numberOfEquations: number
}


export interface PrivateKeySaveDataFormat {
  sec: number
}

export interface PublicKeySaveDataFormat {
  Aval: number[],
  Bval: number[],
  eq: number,
  mod: ModulusValue
}

export interface EncryptedVector {
  u: number,
  v: number
}