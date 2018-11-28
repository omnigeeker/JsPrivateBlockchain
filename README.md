# Private Blockchain with javascript

I build a RESTful API using a Node.js framework that will interface with the private blockchain

## Getting Started

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js web site)[https://nodejs.org/en/].

I use hapijs as the framework of RESTful API.

### Installing
```bash
$ npm install
```
### Usage
After installing please run app in terminal:
```bash
$ node app.js
```
### Clean Architecture
Trying to follow good architecture concepts as the one proposed by Uncle Bob some years ago, called Clean Architecture. It supports the idea of making the model independent from the framework, libraries, dbs…

![Clean Architecture](https://i.imgur.com/OVZdVMr.png)

## Functionality and Testing

#### 1. Blockchain ID Validation Routine

>**Validating User Request**
```bash
curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{"address": "1MNAEsbtomMe8mAUPME7aSfZrUUHqjgg1D"}'
```
>Response
```JSON
{
    "address":"1MNAEsbtomMe8mAUPME7aSfZrUUHqjgg1D",
    "requestTimeStamp":"1543404165",
    "message":"1MNAEsbtomMe8mAUPME7aSfZrUUHqjgg1D:1543406520:starRegistry",
    "validationWindow":300
}
```
>**Verifying User Message Signature**
```bash
curl -X "POST" "http://localhost:8000/message-signature/validate" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "1MNAEsbtomMe8mAUPME7aSfZrUUHqjgg1D",
  "signature": "INIZi3tF/80+J44TlPdFeTiNNLPeA1yDWwr+ALcJ89rdZyVbaBdimBChsTpGwBeBSuiwaetD2pcLW3avuxj8Cic="
}'
```
>Response
```JSON
{
    "registerStar":true,
    "status":{
        "address":"1MNAEsbtomMe8mAUPME7aSfZrUUHqjgg1D",
        "requestTimeStamp":"1543406520",
        "message":"1MNAEsbtomMe8mAUPME7aSfZrUUHqjgg1D:1543406520:starRegistry",
        "validationWindow":254,
        "messageSignature":"valid"
    }
}
```

#### 2. Star Registration Endpoint

>**Request Star Register**
```bash
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "star": {
    "dec": "-26° 29' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}'
```
>Response
```JSON
{
    "hash":"4de184a9ddea223a61a4b378fb88619445f2faab122dc8038a9a8df429966987",
    "height":1,
    "body":{
        "address":"142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star":{
            "dec":"-26° 29' 24.9",
            "ra":"16h 29m 1.0s","story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f","storyDecoded":"Found star using https://www.google.com/sky/"
        }
    },
    "time":"1543411440",
    "previousBlockHash":"e72dd41382d2a8b85564b411efe2f6eadd509f3872348ee36b631a4090506704"
}
```

#### 3. Star Lookup

>**Lookup by Blockchain ID (Wallet Address)**
```bash
curl "http://localhost:8000/stars/address/142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
```
>Response
```JSON
[
  {
    "hash":"4de184a9ddea223a61a4b378fb88619445f2faab122dc8038a9a8df429966987",
    "height":1,
    "body":{
      "address":"142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star":{
        "dec":"-26锟斤拷29' 24.9",
        "ra":"16h 29m 1.0s","story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f","storyDecoded":"Found star using https://www.google.com/sky/"
      }
    },
    "time":"1543411440",
    "previousBlockHash":"e72dd41382d2a8b85564b411efe2f6eadd509f3872348ee36b631a4090506704"
  },{
    "hash":"9a32c87df51b3bea4362f824ed504576147731749b2d581af4a6bcc3602d569e",
    "height":2,
    "body":{
      "address":"142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star":{
        "dec":"-26锟斤拷29' 24.9",
        "ra":"16h 29m 1.0s","story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f","storyDecoded":"Found star using https://www.google.com/sky/"
      }
    },
    "time":"1543411729",
    "previousBlockHash":"4de184a9ddea223a61a4b378fb88619445f2faab122dc8038a9a8df429966987"
  }
]
```
>**Lookup by Block Hash**
```bash
curl "http://localhost:8000/stars/hash/9a32c87df51b3bea4362f824ed504576147731749b2d581af4a6bcc3602d569e"
```
>Response
```JSON
{
  "hash":"9a32c87df51b3bea4362f824ed504576147731749b2d581af4a6bcc3602d569e",
  "height":2,
  "body":{
    "address":"142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star":{
      "dec":"-26锟斤拷29' 24.9",
      "ra":"16h 29m 1.0s","story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f","storyDecoded":"Found star using https://www.google.com/sky/"
    }
  },
  "time":"1543411729",
  "previousBlockHash":"4de184a9ddea223a61a4b378fb88619445f2faab122dc8038a9a8df429966987"
}
```
>**Lookup by Block Height**
```bash
curl "http://localhost:8000/block/1"
```
>Response
```JSON
{
    "hash":"4de184a9ddea223a61a4b378fb88619445f2faab122dc8038a9a8df429966987",
    "height":1,
    "body":{
        "address":"142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star":{
            "dec":"-26° 29' 24.9",
            "ra":"16h 29m 1.0s","story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f","storyDecoded":"Found star using https://www.google.com/sky/"
        }
    },
    "time":"1543411440",
    "previousBlockHash":"e72dd41382d2a8b85564b411efe2f6eadd509f3872348ee36b631a4090506704"
}
```


## Built With

* [Express](https://expressjs.com/) - The web framework used
* [Level](https://github.com/Level/level) - A Node.js-style LevelDB wrapper to persist blockchain
* [CryptoJS](https://www.npmjs.com/package/crypto-js) - Used to generate SHA256 block hash address
* [Joi](https://github.com/hapijs/joi) - Object schema validation
* [BitcoinJS](https://www.npmjs.com/package/bitcoinjs-lib) - Used for validating message signatures
* [JSONPath](https://www.npmjs.com/package/jsonpath) - Query JavaScript objects with JSONPath expressions
