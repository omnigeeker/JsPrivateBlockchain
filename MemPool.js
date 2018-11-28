/* ===== MemPool Class ==============================
|  Class with a constructor for MemPool 			   |
|  ===============================================*/
const bitcoinMessage = require('bitcoinjs-message'); 
const TimeoutRequestsWindowTime = 5*60*1000;

class MemPool{
    constructor(server) {
        this.mempool = new Map();;
        this.timeoutRequests = new Map();;
    }

    requestValidation(address) {
        const self = this;
        let currentTimeStamp = new Date().getTime().toString().slice(0, -3);
        //let timeElapse = (new Date().getTime().toString().slice(0,-3)) - requestTimeStamp;
        //let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
        //req.validationWindow = timeLeft;

        let requestTimeStamp = currentTimeStamp;
        let timeElapse = 0;

        if (this.mempool.has(address)) {
            let requestTimeStamp = this.mempool.get(address);
            let timeElapse = currentTimeStamp - requestTimeStamp;
        } else {
            this.mempool.set(address, currentTimeStamp);
            this.timeoutRequests.set(address, setTimeout(function(){
                self.mempool.delete(address);
                self.timeoutRequests.delete(address);
            }, TimeoutRequestsWindowTime));
        }
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
        let message = address+':'+requestTimeStamp+':starRegistry';
        console.log(message);

        return {
            address: address,
            requestTimeStamp: requestTimeStamp,
            message: message,
            validationWindow: timeLeft
        }
    }

    isExpired(address) {
        if (this.mempool.has(address)) 
            return false;
        return true;
    }

    getMessageSignatureValidationObject (address, signature) {
        if (!this.mempool.has(address)) 
            return null;        
        let requestTimeStamp = this.mempool.get(address);
        let message = address+':'+requestTimeStamp+':starRegistry';
        let isValid = bitcoinMessage.verify(message, address, signature);
        let currentTimeStamp = new Date().getTime().toString().slice(0, -3);
        let timeElapse = currentTimeStamp - requestTimeStamp;
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
        return {
            registerStar: isValid,
            status: {
                address: address,
                requestTimeStamp: requestTimeStamp,
                message: message,
                validationWindow: timeLeft,
                messageSignature: isValid == true? "valid" : "Invalid",
            }
        };
    }
}

module.exports = MemPool;