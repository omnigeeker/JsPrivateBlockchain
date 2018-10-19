
simpleChain = require('./simpleChain.js');

let blockchain = new simpleChain.Blockchain();

(async () => { 
    for (var i = 0; i <= 10; i++) {
        await blockchain.addBlock(new simpleChain.Block("test data "+i));
    }

    chainLength = await blockchain.getBlockHeight();
    console.log("chain legth: " + chainLength);
    console.log();
    
    await blockchain.validateChain();
    console.log();
    
    let inducedErrorBlocks = [2,4,7];
    for (var i = 0; i < inducedErrorBlocks.length; i++) {
        await blockchain.inducedBlockData(inducedErrorBlocks[i]);
    }
    
    await blockchain.validateChain();
    console.log();
  
})();
