const SHA256 = require('crypto-js/sha256');
const Block = require('./Block.js');
const BlockChain = require('./BlockChain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        this.blockchain = new BlockChain();
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/api/block/{index}',
            handler: async (request, h) => {
                let block = await this.blockchain.getBlock(request.params.index);
                return JSON.stringify(block)
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    async postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/api/block',
            handler: async (request, h) => {
                let payload = request.payload;   // <-- this is the important line
                console.log("payload: " + payload);
                try {
                    if (payload === null) { // No HTTP body, so check the block chain
                        return  await this.blockchain.validateChain();
                    }
                    console.log(payload);
                    let data = payload.data;
                    let newBlock = await this.blockchain.addBlock(new Block(data));
                    return JSON.stringify(newBlock)
                } catch(err) {
                    return "Error: " + err;
                }
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    async initializeMockData() {
        console.log("initializeMockData");
        try {
            let chainLength = await this.blockchain.getBlockHeight();
            if(chainLength === 0){
                console.log("chainLength is 0, so create some blocks");
                for (var i = 0; i < 10; i++) {
                    await this.blockchain.addBlock(new Block("test data "+i));
                }
            }
            chainLength = await this.blockchain.getBlockHeight();
            console.log("chain legth: " + chainLength);
        } catch(err) {
            console.log("initializeMockData Error: " + err);
        }
    }
}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}