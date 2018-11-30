const SHA256 = require('crypto-js/sha256');
const Block = require('./Block.js');
const BlockChain = require('./BlockChain.js');
const Joi = require("joi");
const MemPool = require("./MemPool.js")

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
        this.mempool = new MemPool();
        this.initializeMockData();
        this.getBlockByIndex();
        this.requestValidation();
        this.messageSignatureValidation();
        this.getBlockByHash();
        this.getBlocksByAddress();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/block/{height}',
            handler: async (request, h) => {
                try {
                    let block = await this.blockchain.getBlock(request.params.height);
                    const response = h.response('success');
                    return block;
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
                const starSchema = Joi.object({
                    dec: Joi.string().required(), //"-26° 29'\'' 24.9",
                    ra: Joi.string().required(), //"16h 29m 1.0s",
                    story: Joi.string().regex(/^[\x00-\x7F]+$/).min(4).max(500).required(),
                    mag: Joi.string(),
                    constellation: Joi.string().length(3)
                });
                const schema = {
                    address: Joi.string().required(),
                    star: starSchema
                };

                const { error } = Joi.validate(request.payload, schema);
                if (error)
                    return h.response(error.details[0].message).code(400);

                let body = request.payload;   
                let address = body.address;
                if (this.mempool.isExpired(address))
                   return h.response('No validation window; Please request validation again.').code(400);
                let starStory = body.star.story
                body.star.storyDecoded = starStory;
                body.star.story = Buffer(starStory).toString('hex');

                
                try {
                    console.log("body: " + body);
                    let newBlock = await this.blockchain.addBlock(new Block(body));
                    this.mempool.removeValidationRequest(address);
                    return newBlock
                } catch(err) {
                    return "Error: " + err;
                }
            }
        });
    }

    requestValidation() {
        this.server.route({
            method: 'POST',
            path: '/requestValidation',
            handler: async (request, h) => {
                const schema = {
                    address: Joi.string().required()
                }
            
                const { error } = Joi.validate(request.payload, schema);
                if (error)
                    return h.response(error.details[0].message).code(400);

                console.log(request.payload)
                let address = request.payload.address;
                let currentTimeStamp = new Date().getTime().toString().slice(0, -3);
                let ret = this.mempool.requestValidation(address, currentTimeStamp);
                return ret;
            }
        });
    }

    messageSignatureValidation() {
        this.server.route({
            method: 'POST',
            path: '/message-signature/validate',
            handler: async (request, h) => {
                const schema = {
                    address: Joi.string().required(),
                    signature: Joi.string().required()
                }
            
                const { error } = Joi.validate(request.payload, schema);
                if (error)
                    return h.response(error.details[0].message).code(400);

                let body = request.payload;
                let address = body.address;
                let signature = body.signature;

                if (this.mempool.isExpired(address))
                    return h.response('Validation window is expired!; Please request validation again.').code(400);

                let ret = this.mempool.getMessageSignatureValidationObject(address, signature);
                return ret;
            }
        });
    }

    async getBlockByHash() {
        this.server.route({
            method: 'GET',
            path: '/stars/hash:{hash}',
            handler: async (request, h) => {
                console.log(request.params);
                const schema = {
                    hash: Joi.string().required()
                }          
                const { error } = Joi.validate(request.params, schema);
                if (error)
                    return h.response(error.details[0].message).code(400);

                try {
                    let hash = request.params.hash;
                    let block = await this.blockchain.getBlockByHash(hash);
                    if (block === null) 
                        return h.response("Not Found").code(404);
                    return block;
                } catch(err) {
                    return h.response(err.toString()).code(400);
                }
            }
        });
    }

    async getBlocksByAddress() {
        this.server.route({
            method: 'GET',
            path: '/stars/address:{address}',
            handler: async (request, h) => {
                const schema = {
                    address: Joi.string().required()
                }
                const { error } = Joi.validate(request.params, schema);
                if (error)
                    return h.response(error.details[0].message).code(400);

                try {
                    let address = request.params.address;
                    let block = await this.blockchain.getBlockByAddress(address);
                    if (block === null) 
                        return h.response("Not Found").code(404);
                    return block;
                } catch(err) {
                    return h.response(err.toString()).code(400);
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