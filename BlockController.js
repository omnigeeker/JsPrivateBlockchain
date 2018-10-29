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
     * Implement a GET Endpoint to retrieve a block by index, url: "/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/block/{index}',
            handler: async (request, h) => {
                try {
                    let block = await this.blockchain.getBlock(request.params.index);
                    const response = h.response('success');
                    response.type('text/json');
                    return JSON.stringify(block)
                } catch(e) {
                    return "The block " + request.params.index + " is out of bounds"; 
                }
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/block"
     */
    async postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/block',
            handler: async (request, h) => {
                let payload = request.payload;   // <-- this is the important line
                console.log("payload: " + payload);
                try {
                    console.log("payload: " + payload);
                    if (payload === null) { // No HTTP body, so check the block chain
                        return await this.blockchain.validateChain();
                    }
                    if (payload.body === undefined) {
                        return "no body param in request body json";
                    }
                    let body = payload.body;
                    let newBlock = await this.blockchain.addBlock(new Block(body));
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
        try {
            let chainLength = await this.blockchain.getBlockHeight();
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