// publisher / subscriber
const PubNub = require('pubnub');

const credentials = {
   publishKey: 'pub-c-58b2d9cf-520e-4c9f-bfdb-fb23ceb73bac',
   subscribeKey: 'sub-c-93dfe3ec-30f5-11e9-b681-be2e977db94e',
   secretKey: 'sec-c-OTJkZGUwMGMtNzI2MC00MWE4LWFmZTctNjVmOWExZjc3MzA2'
};

const CHANNELS = {
   TEST: 'TEST'
}

class PubSub {
   constructor() {
      this.pubnub = new PubNub(credentials);

      this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

      this.pubnub.addListener(this.listener());
   }

   listener() {
      return {
         message: messageObject => {
            const { channel, message } = messageObject;

            console.log(`Message received. Channel: ${channel}. Message: ${message}`)
         }
      };
   }

   publish({ channel, message }) {
      this.pubnub.publish({ channel, message });
   }
}

module.exports = PubSub;