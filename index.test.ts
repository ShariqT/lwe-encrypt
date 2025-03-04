import { expect, test, spyOn } from "bun:test";
import { PrivateKey, PublicKey } from ".";
import { type KeyOptions } from "./types";
import { encryptBit, 
        decryptBit, 
        convertStringToIntArray, 
        convertIntArrayToBitArray, 
        encryptString,
        decryptData,
      } from "./utils";

test("Public Key correctly generates A vector values", () => {
  const opts: KeyOptions = {
    modNumber: 13,
    errorVector: [1,2, 1],
    numberOfEquations: 3
  }
  const key = new PublicKey(opts)
  key.generateKeyValues(5)
  expect(key.getA().length).toEqual(3)
  expect(key.getA()[0]).toBeLessThan(key.modulus)
  expect(key.getA()[1]).toBeLessThan(key.modulus)
  expect(key.getA()[2]).toBeLessThan(key.modulus)
})

test("Public Key only accepts correct length for A vector", () => {
  const opts: KeyOptions = {
    modNumber: 13,
    errorVector: [1,2, 1],
    numberOfEquations: 3
  }
  const key = new PublicKey(opts)
  expect(() =>{
    key.setAVec([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 11])
  }).toThrow()
})

test("Public Key only accepts correct values for A", () => {
  const opts: KeyOptions = {
    modNumber: 13,
    errorVector: [1,2, 1],
    numberOfEquations: 3
  }
  const key = new PublicKey(opts)
  expect(() =>{
    key.setAVec([99, 2, 3])
  }).toThrow()
})


test("Public Key only accepts vector for A", () => {
  const opts: KeyOptions = {
    modNumber: 13,
    errorVector: [1,2, 1],
    numberOfEquations: 3
  }
  const key = new PublicKey(opts)
  const val = [1, 2, 3]
  key.setAVec(val)
  expect(key.getA()).toStrictEqual(val)

  
})


test("Public Key correctly generates B vector in length", () => {
  const opts: KeyOptions = {
    modNumber: 13,
    errorVector: [1,2, 1],
    numberOfEquations: 3
  }
  const key = new PublicKey(opts)
  key.generateKeyValues(5)
  expect(key.getB().length).toEqual(key.numberOfEquations)
})


test("Public Key correctly generates B vector values", () => {
  const opts: KeyOptions = {
    modNumber: 97,
    errorVector: [1, 1, 4, 1, 4],
    numberOfEquations: 5
  }
  const pubkey = new PublicKey(opts)
  pubkey.setAVec([6, 38, 90, 83, 51])
  pubkey.generateKeyValues(5)
  const secretKey = new PrivateKey(opts)
  secretKey.setSecret(5)
  const vectorB = pubkey.getB()
  expect(vectorB).toEqual([31, 94, 66, 28, 65])
})


test("encryptBit and decryptBit returns the correct values", () => {
  const opts: KeyOptions = {
    modNumber: 97,
    errorVector: [1, 1, 4, 1, 4, 3, 2, 4, 1, 2, 3, 4, 3, 3, 2, 1, 1, 3, 4, 1],
    numberOfEquations: 20
  }
  const secretValue = 5

  const pubkey = new PublicKey(opts)
  pubkey.setAVec([6, 38, 90, 83, 51, 15, 31, 40, 18, 0, 10, 89, 93, 88, 32, 52, 24, 86, 82, 92])
  pubkey.generateKeyValues(secretValue)
  const secretKey = new PrivateKey(opts)
  secretKey.setSecret(secretValue)
  let message = 1
  let ev = encryptBit(pubkey, message)  
  let decryptedMessage = decryptBit(secretKey, ev)
  expect(message).toEqual(decryptedMessage)

  message = 0
  ev = encryptBit(pubkey, message)  
  decryptedMessage = decryptBit(secretKey, ev)
  expect(message).toEqual(decryptedMessage)
})


test("encrypt and decrypt on higher values ex, 1024", () => {
  const errs = []
  for(let i = 0; i < 1024; i++){
    errs.push(Math.floor(Math.random() * 4))
  }
  const opts: KeyOptions = {
    modNumber: 3557,
    errorVector: errs,
    numberOfEquations: 1024
  }
  const secretValue = 200

  const pubKey = new PublicKey(opts)
  const privKey = new PrivateKey(opts)
  pubKey.generateKeyValues(secretValue)
  privKey.setSecret(secretValue)

  let message = 1
  let ev = encryptBit(pubKey, message)  
  let decryptedMessage = decryptBit(privKey, ev)
  expect(message).toEqual(decryptedMessage)

  message = 0
  ev = encryptBit(pubKey, message)  
  decryptedMessage = decryptBit(privKey, ev)
  expect(message).toEqual(decryptedMessage)
})

test("encrypt and decrypt on higher values ex, 2048", () => {
  const errs = []
  for(let i = 0; i < 2048; i++){
    errs.push(Math.floor(Math.random() * 4))
  }
  const opts: KeyOptions = {
    modNumber: 73043,
    errorVector: errs,
    numberOfEquations: 2048
  }
  const secretValue = 8123

  const pubKey = new PublicKey(opts)
  const privKey = new PrivateKey(opts)
  pubKey.generateKeyValues(secretValue)
  privKey.setSecret(secretValue)

  let message = 1
  let ev = encryptBit(pubKey, message)  
  let decryptedMessage = decryptBit(privKey, ev)
  expect(message).toEqual(decryptedMessage)

  message = 0
  ev = encryptBit(pubKey, message)  
  decryptedMessage = decryptBit(privKey, ev)
  expect(message).toEqual(decryptedMessage)
})


test("converting string to a uint array", () => {
  const bits = convertStringToIntArray("hi")
  const comp = new Uint8Array(2)
  comp[0] = 104
  comp[1] = 105
  expect(bits).toEqual(comp)
})

test("converting uint array into 8 bit array", () => {
  const bits = convertIntArrayToBitArray(104)
  expect(bits).toEqual([0,1,1,0,1,0,0,0])
})

test("encode a string", () => {
  const errs = []
  for(let i = 0; i < 1024; i++){
    errs.push(Math.floor(Math.random() * 4))
  }
  const opts: KeyOptions = {
    modNumber: 3557,
    errorVector: errs,
    numberOfEquations: 1024
  }
  const secretValue = 200

  const pubKey = new PublicKey(opts)
  const privKey = new PrivateKey(opts)
  pubKey.generateKeyValues(secretValue)
  privKey.setSecret(secretValue)

  let encryptedArray = encryptString("hi", pubKey)
  let answer = decryptData(encryptedArray, privKey)
  expect(answer).toEqual('hi')

  encryptedArray = encryptString("hello world!", pubKey)
  answer = decryptData(encryptedArray, privKey)
  expect(answer).toEqual('hello world!')
})

test("saves public key info", async () => {
  const errs = []
  for(let i = 0; i < 1024; i++){
    errs.push(Math.floor(Math.random() * 4))
  }
  const opts: KeyOptions = {
    modNumber: 3557,
    errorVector: errs,
    numberOfEquations: 1024
  }
  const secretValue = 200

  const pubKey = new PublicKey(opts)
  pubKey.generateKeyValues(secretValue)
  await pubKey.saveToFile()
  const isFileThere = await Bun.file("pub.lwe.key").exists()
  expect(isFileThere).toBe(true)
  await Bun.file("pub.lwe.key").delete()

})

test("saves private key info", async () => {
  const errs = []
  for(let i = 0; i < 1024; i++){
    errs.push(Math.floor(Math.random() * 4))
  }
  const opts: KeyOptions = {
    modNumber: 3557,
    errorVector: errs,
    numberOfEquations: 1024
  }
  const secretValue = 200

  const privKey = new PrivateKey(opts)
  await privKey.saveToFile()
  const isFileThere = await Bun.file("sec.lwe.key").exists()
  expect(isFileThere).toBe(true)
  await Bun.file("sec.lwe.key").delete()

})

test("loads private key from a file", async () => {
  await Bun.write("sec.lwe.key", JSON.stringify({
    sec: 5
  }))
  const key = await PrivateKey.fromKeyFile("sec.lwe.key")
  expect(key.secretValue).toEqual(5)
  await Bun.file("sec.lwe.key").delete()
})

test("loads public key from a file", async () => {
  await Bun.write("pub.lwe.key", JSON.stringify({
    Aval: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    Bval: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33 ],
    eq: 13

  }))
  const key = await PublicKey.fromKeyFile("pub.lwe.key")
  expect(key.getA()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
  expect(key.getB()).toEqual( [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33 ])
  expect(key.numberOfEquations).toEqual(13)
  await Bun.file("pub.lwe.key").delete()
})