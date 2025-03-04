import type { PrivateKey, PublicKey } from ".";
import type { EncryptedVector } from "./types";

function getRandomNumber(max: number, amountToReturn: number): number[] {
    let ret: number[] = []
    for( let i = 0; i  < amountToReturn; i++){
      ret.push(Math.floor(Math.random() * max))
    }
    return ret
  }

 

export function encryptBit(publicKey: PublicKey, bitToEncrypt: number) : EncryptedVector {
  let sampleRate = Math.floor(publicKey.numberOfEquations / 2)
  const samples = getRandomNumber(publicKey.numberOfEquations, sampleRate)
  let sumForASamples = 0
  let sumForBSamples = 0
  samples.map((val) => {
    sumForASamples = sumForASamples + publicKey.getA()[val] 
  })
  samples.map((val) => {
    sumForBSamples = sumForBSamples + publicKey.getB()[val]
  })

  const u = sumForASamples % publicKey.modulus
  const v = (sumForBSamples + Math.floor(publicKey.modulus / 2) * bitToEncrypt) % publicKey.modulus
  
  return {
    u: u,
    v: v 
  }
}

export function decryptBit(secretKey: PrivateKey, encrytedData: EncryptedVector) : number {
  const bitCheck = Math.floor(secretKey.modulus / 2);
  const valFromVector = encrytedData.v - secretKey.secretValue * encrytedData.u
  // this is line is because JS does not handle modolo operations like Python. It 
  // retains the sign from the first part of the division operation. The reference
  // implementation for this technique is in Python, so to make JS play nice, I am 
  // adding this extra computation. For the record, the decrypt equation is (v - s * u) mod q
  // https://stackoverflow.com/questions/41239190/result-of-17-is-different-in-javascript-1-and-python6
  const dec =  ((valFromVector % secretKey.modulus) + secretKey.modulus) % secretKey.modulus

  if (dec > bitCheck) {
    return 1
  }
  return 0
}

export function convertStringToIntArray(str: string) : Uint8Array<ArrayBufferLike> {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

export function convertIntArrayToBitArray(input: number) : number[] {
  if (input < 0) {
    throw new Error("The number must be non-negative.");
  }

  const binaryArray: number[] = [];
  while (input > 0) {
      binaryArray.unshift(input % 2);
      input = Math.floor(input / 2);
  }
  binaryArray.unshift(0)
  return binaryArray.length > 0 ? binaryArray : [0];
}


export function encryptString(value: string, publicKey: PublicKey) : EncryptedVector[][] {
  const intArray = convertStringToIntArray(value)
  let results: EncryptedVector[][] = []

  for (let i = 0 ; i < intArray.length; i++){
    let bitArray = convertIntArrayToBitArray(intArray[i])
    let tempArray = []
    for (let a = 0; a < bitArray.length; a++){
      tempArray.push(encryptBit(publicKey, bitArray[a]))
    }
    results.push(tempArray)
  }
  return results
}

function binaryToString(binary: string): string {
  const bytes = binary.split(' ');
  let result = '';

  for (const byte of bytes) {
    result += String.fromCharCode(parseInt(byte, 2));
  }

  return result;
}

export function decryptData(data: EncryptedVector[][], privateKey: PrivateKey) : string {
  let finalString = ''
  for (let i = 0; i < data.length; i++) {
    let tempArray = []
    for (let a = 0; a <  data[i].length; a++) {
      tempArray.push(decryptBit(privateKey, data[i][a]))
    }
    finalString = finalString + binaryToString(tempArray.join(''))
  }
  return finalString
}

