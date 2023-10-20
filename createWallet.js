const bitcoin = require('bitcoinjs-lib');
const fs = require("fs");
const BigNumber = require("bignumber.js")

const { record } = require("./record.json")

const from = '0000000000000000000000000020000000000000000000000000000000000000';
const to = "00000000000000000000000000000000000000000001ffffffffffffffffffff";

const getPublicKey = (privateKey) => {
    const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
    const publicKey = keyPair.publicKey.toString('hex');
    const { address } = bitcoin.payments.p2pkh({ pubkey: new Buffer(publicKey, "hex") })
    if (address === "15qsCm78whspNQFydGJQk5rexzxTQopnHZ") {
        fs.writeFileSync("./result.ss", JSON.stringify({ privateKey }), { flag: "a" })
    }
}

const start = () => {
    let startValue = BigNumber(record, 16);
    let i = 0;
    while (1) {
        let hexString = startValue.toString(16).padStart(64, "0");
        startValue = startValue.minus(1);
        getPublicKey(hexString)
        if (hexString === to) {
            console.log("can't find")
            break;
        }
        i++;
        if (i === 1600) {
            i = 0;
            console.log("here", hexString)
            fs.writeFileSync("./record.json", `{"record" : "${hexString}"}`)
        }
    }
}

start();