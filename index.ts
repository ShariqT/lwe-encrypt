import { type KeyType, type KeyOptions, type ModulusValue, type PublicKeySaveDataFormat, type PrivateKeySaveDataFormat } from "./types"
class Key {
  modulus: ModulusValue = 73043;
  numberOfEquations: number;
  errorVector: number[];

  constructor(options: KeyOptions) {
    this.modulus = options.modNumber;
    this.numberOfEquations = options.numberOfEquations
    this.errorVector = options.errorVector
  }

  saveFileToDirectory(directory?: string) : string{
    if (directory === undefined) {
      directory = "."
    }
    return directory
  }

}

export class PublicKey extends Key {
  protected B: number[] = [];
  protected A: number[] = [];

  constructor(options: KeyOptions, Bvector?: number[]){
    super(options)
    if (Bvector != undefined){
      this.B = Bvector
    }
  }
  protected randomize() : number{
    return Math.floor(Math.random() * this.modulus)
  }
  protected getRandomValuesForA() {
    for (let i = 0; i < this.numberOfEquations; i++) {
      this.A[i] = this.randomize()
    }
  }

  static async fromKeyFile(keyfilePath: string) : Promise<PublicKey> {
    const keyfile = await Bun.file(keyfilePath)
    const keydata : PublicKeySaveDataFormat = await keyfile.json()
    const key = new PublicKey({
      errorVector: [],
      modNumber: 13,
      numberOfEquations: keydata.eq
    }, keydata.Bval)
    key.setAVec(keydata.Aval)
    // key.setBVec(keydata.Bval)
    return key
  }

  setAVec(vector: number[]) {
    // check to make sure that the vector array is not longer than the number of equations
    if( vector.length > this.numberOfEquations || vector.length < this.numberOfEquations - 1) {
      throw new Error("You had more values than what is neccsary. ")
    }
    vector.map((val) => {
      if (val > this.modulus) {
        throw new Error("All values in vector A need to be less than " + this.modulus)
      }
    })
    this.A = vector
  }
  // setBVec(vector: number[]) {
  //   if (this.B.length > 0) {
  //     throw new Error("B values have already been generated for this key. Do not generate again!")
  //   }
  //   this.B = vector
  // }

  getA() : number[]{
    return this.A
  }

  getB() : number[] {
    return this.B
  }

  generateKeyValues(secret: number) {
    if (this.A.length == 0 ){
      this.getRandomValuesForA()
    }
    for( let i = 0; i < this.numberOfEquations; i++) {
      this.B[i] = (this.A[i] * secret + this.errorVector[i]) % this.modulus
    }
  }

  async saveToFile(directory?: string){
    const path = super.saveFileToDirectory(directory)
    await Bun.write(path  + "/pub.lwe.key", JSON.stringify({
        Aval: this.A,
        Bval: this.B,
        eq: this.numberOfEquations
      })
    )
  }

}

export class PrivateKey extends Key {
  secretValue: number = 5;

  setSecret(secret: number) {
    this.secretValue = secret
  }

  async saveToFile(directory?: string){
    const path = super.saveFileToDirectory(directory)
    await Bun.write(path + "/sec.lwe.key", JSON.stringify({
      sec: this.secretValue
      })
    )
  }

  static async fromKeyFile(keyfilePath: string): Promise<PrivateKey>{
    const keyfile = await Bun.file(keyfilePath)
    const keydata : PrivateKeySaveDataFormat = await keyfile.json()
    const key = new PrivateKey({
      errorVector: [],
      numberOfEquations: 1,
      modNumber: 13
    })
    key.setSecret(keydata.sec)
    return key
  }
}



