# lwe-encrypt


# What is this library's purpose?
This is a Typescript implementation of the Learning With Errors crypto algorithim. The
LWE is a quantum-resistant algorithim based on matrices. Encoded information is in the
form of a vector. 

To read more about LWE, you can refer to this [Medium article](https://medium.com/asecuritysite-when-bob-met-alice/learning-with-errors-and-ring-learning-with-errors-23516a502406) or the [original paper published in 2005](https://cims.nyu.edu/~regev/papers/lwesurvey.pdf). 

# Who should use this library?
If you are interested in securing information outside of the usual methods presented, i.e. RSA, PGP, etc. 


# How to use

```ts
import { PublicKey, PrivateKey } from '@reese-codes/lwe-encrypt'
import { KeyOptions } from '@reese-codes/lwe-encrypt/types'
import { encryptString, decryptData } from '@reese-codes/lwe-encrypt/utils'

// set up an array of error values; this MUST match the 
// numberOfEquations parameter in the KeyOptions type
const errs = []
for(let i = 0; i < 1024; i++){
  errs.push(Math.floor(Math.random() * 4))
}
const opts: KeyOptions = {
  modNumber: 3557,
  errorVector: errs,
  numberOfEquations: 1024
}

// you must keep this value and the error array secret. If an attacker were to get their
// hands on both, then they could reverse engineer any message. 
const secretValue = 200

const pubKey = new PublicKey(opts)
const privKey = new PrivateKey(opts)

// you must call this function to generate "B" values; there are values that take 
// into account the values from the error array and the secret
pubKey.generateKeyValues(secretValue)

privKey.setSecret(secretValue)

// encrypt a string
const encryptedData = encryptString("hello world", pubKey)

// decrypt a string
const message = decryptData(encrytedData, privKey)

// saves a pub.lwe.key file to the current directory 
pubKey.saveToFile()

// saves a sec.lwe.key file to the current direcotry
privKey.saveToFile()

//create a PublicKey instance from a pub.lwe.key file
PublicKey.fromKeyFile("pub.lwe.key")

//create a PrivatecKey instance from a pub.lwe.key file
PrivateKey.fromKeyFile("sec.lwe.key")

//load a PublicKey from JSON data 
PublicKey.fromJSON(keydata)

//export PublicKey data as a JSON Object
pubKey.toJSON()
```