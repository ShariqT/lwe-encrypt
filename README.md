# lwe-encrypt


# What is this library
This is a Typescript implementation of the Learning With Errors crypto algorithim. The
LWE is a quantum-resistant algorithim based on matrices. Encoded information is in the
form of a vector. 

To read more about LWE, you can refer to this Medium article or the original paper published in 2005. 

# Who should use this library
If you interested in securing information outside of the usual methods presented, i.e. RSA, PGP, etc. 

# Caveats
This library has not been audited. Use in production systems at your own risk. 

# How to use

```
import { PublicKey, PrivateKey } from 'lwe-encrypt'
import { encryptString, decryptString } from 'lwe-encrypt/utils'

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

// encrypt a string
const encryptedData = encryptString("hello world", pubKey)

// decrypt a string
const message = decryptData(encrytedData, privKey)

// saves a pub.lwe.key file to the current directory 
pubKey.saveToFile()

// saves a sec.lwe.key file to the current direcotry
privKey.saveToFile()

```