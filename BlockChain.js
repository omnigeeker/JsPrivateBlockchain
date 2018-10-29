/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './data';
const db = level(chainDB);
const Block = require('./Block.js')

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {
    this.createGenesisBlock();
  }

  async createGenesisBlock() {
    let chainLength = await this.getBlockHeight();
    if(chainLength === 0){
      console.log("chainLength is 0, so create some blocks");
      await this.addBlock(new Block("genesis block"));
    }
  }

  // Add new block
  async addBlock(newBlock){
    try {
      let chainLength = await this.getBlockHeight();
      
      // Block height
      newBlock.height = chainLength;
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0,-3);

      // previous block hash
      newBlock.height = chainLength;
      if(chainLength>0){
        let lastBlock = await this.getBlock(chainLength-1);
        newBlock.previousBlockHash = lastBlock.hash;
      }

      // Block hash with SHA256 using newBlock and converting to a string
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
      await this.setBlock(newBlock.height, newBlock);
      console.log("addBlock: " + newBlock);
      return newBlock;
    } catch(err) {
      console.log("addBlock error: " + err);
      return null;
    }
  }

  // Get block height
  getBlockHeight(){
    return new Promise((resolve, reject) => {
      let count = 0;
      db.createReadStream()
      .on('data', function (data) {
        count ++;
      })
      .on('error', function (err) {
        reject('Error :' +err);
      })
      .on('close', function () {
        resolve(count);
      });
    });
  }

  // get block
  getBlock(blockHeight){
    // return object as a single string
    return new Promise((resolve, reject) => {
      db.get(blockHeight, (err, value) => {
        if (err) {
          reject('Not found: ' + err);
        } else {
          resolve(JSON.parse(value));
        }
      })
    })
  }

  // set block object to chain
  setBlock(blockHeight, newBlock) { 
    return new Promise((resolve, reject) => {
      db.put(blockHeight, JSON.stringify(newBlock), (err) => {
        if (err) {
          reject('Add leveldb err: ' + err);
        } else {
          resolve(newBlock.hash);
        }
      })
    })
  };

  getAll() {
    return new Promise((resolve, reject) => {
      db.createReadStream()
      .on('data', function (data) {
        console.log(data);
      })
      .on('error', function (err) {
        reject('Error :' + err);
      })
      .on('close', function () {
        console.log("End");
      });
    })
  }

  // validate block
  async validateBlock(blockHeight){
    try {
      // get block object
      let block = await this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
        return true;
      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        return false;
      }
    } catch(err) {
      console.log("validateBlock error: " + err);
    }
  }

  // Validate blockchain
  async validateChain(){
    try {
      let errorLog = [];
      let chainLength = await this.getBlockHeight();
      for (var i = 0; i < chainLength-1; i++) {
        // validate block
        if (!(await this.validateBlock(i)))
          errorLog.push(i);
        // compare blocks hash link
        let blockHash = (await this.getBlock(i)).hash;
        let previousHash = (await this.getBlock(i+1)).previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        let msg = 'validateChain: Error Blocks: '+errorLog;
        console.log(msg);
        return msg;
      } else {
        let msg = 'validateChain: No errors detected';
        console.log(msg);
        return msg;
      }
    } catch(err) {
      let msg = "validateChain: " + err;
      console.log(msg);
      return msg;
    }
  }

  // Change blockchain to error
  async inducedBlockData(blockHeight){
    try {
      let block = await this.getBlock(blockHeight);
      block.data = 'induced chain error';
      await this.setBlock(blockHeight, block);
    } catch(err) {
      console.log("changgeBlockData: " + err);
    }
  }
}

module.exports = Blockchain;
