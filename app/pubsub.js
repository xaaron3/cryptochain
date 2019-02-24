// publisher / subscriber
const PubNub = require('pubnub');

const credentials = {
   publishKey: 'pub-c-58b2d9cf-520e-4c9f-bfdb-fb23ceb73bac',
   subscribeKey: 'sub-c-93dfe3ec-30f5-11e9-b681-be2e977db94e',
   secretKey: 'sec-c-OTJkZGUwMGMtNzI2MC00MWE4LWFmZTctNjVmOWExZjc3MzA2'
};

const CHANNELS = {
   TEST: 'TEST',
   BLOCKCHAIN: 'BLOCKCHAIN',
   TRANSACTION: 'TRANSACTION'
};

class PubSub {
   constructor({ blockchain, transactionPool, wallet }) {
      this.blockchain = blockchain;
      this.transactionPool = transactionPool;
      this.wallet = wallet;

      this.pubnub = new PubNub(credentials);

      this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] });

      this.pubnub.addListener(this.listener());
   }

   broadcastChain() {
      this.publish({
         channel: CHANNELS.BLOCKCHAIN,
         message: JSON.stringify(this.blockchain.chain)
      });
   }

   broadcastTransaction(transaction) {
      this.publish({
         channel: CHANNELS.TRANSACTION,
         message: JSON.stringify(transaction)
      });
   }

   subscribeToChannels() {
      this.pubnub.subscribe({
         channels: [Object.values(CHANNELS)]
      });
   }

   listener() {
      return {
         message: messageObject => {
            const { channel, message } = messageObject;

            console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            const parsedMessage = JSON.parse(message);

            switch (channel) {
               case CHANNELS.BLOCKCHAIN:
                  this.blockchain.replaceChain(parsedMessage, true, () => {
                     this.transactionPool.clearBlockchainTransactions(
                        { chain: parsedMessage.chain }
                     );
                  });
                  break;
               case CHANNELS.TRANSACTION:
                  if (!this.transactionPool.existingTransaction({
                     inputAddress: this.wallet.publicKey
                  })) {
                     this.transactionPool.setTransaction(parsedMessage);
                  }
                  break;
               default:
                  return;
            }
         }
      }
   }

   publish({ channel, message }) {

      this.pubnub.publish({ message, channel });
   }

   broadcastChain() {
      this.publish({
         channel: CHANNELS.BLOCKCHAIN,
         message: JSON.stringify(this.blockchain.chain)
      });
   }

   broadcastTransaction(transaction) {
      this.publish({
         channel: CHANNELS.TRANSACTION,
         message: JSON.stringify(transaction)
      });
   }
}

module.exports = PubSub;