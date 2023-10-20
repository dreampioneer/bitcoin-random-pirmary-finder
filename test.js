const axios = require("axios");
const crypto = require("crypto");
const bitcoin = require("bitcoinjs-lib");
const fs = require("fs");
const util = require("util");
const appendFileAsync = util.promisify(fs.appendFile);
const filePath = 'public_key.txt';
async function getBalance(publicKey) {
  try {
    const response = await axios.get(
      `https://blockchain.info/balance?active=${publicKey}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function generateRandomBitcoinPrivateKey() {
  // Bitcoin private keys are 64 characters in hexadecimal (32 bytes)
  const privateKeyBytes = crypto.randomBytes(32);
  const privateKeyHex = privateKeyBytes.toString("hex");
  return privateKeyHex;
}

const getPublicKey = (privateKey) => {
  const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"));
  const publicKey = keyPair.publicKey.toString("hex");
  const { address } = bitcoin.payments.p2pkh({
    pubkey: new Buffer(publicKey, "hex"),
  });
  return address;
};

async function main() {
  let i = 0;
  while (1) {
    try {
      const randomHexString = generateRandomBitcoinPrivateKey();
      i++;
      if (i == 10) {
        console.log("here", randomHexString);
        i = 0;
      }
      const publicKey = getPublicKey(randomHexString);
      // let walletInfo = await getBalance(publicKey);
      // let balance = walletInfo[publicKey]["final_balance"];
      const dataToAppend = JSON.stringify({ publicKey, randomHexString }) + '\n';
      await appendFileAsync(filePath, dataToAppend);
      // if (balance) {
      //   fs.writeFileSync(
      //     `./${publicKey}.json`,
      //     JSON.stringify({ publicKey, randomHexString, balance })
      //   );
      // }
    } catch (error) {
      console.error(error);
    }
  }
}

main(); // Call the main function to start the process
