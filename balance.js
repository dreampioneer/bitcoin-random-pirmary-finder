const readline = require("readline");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const appendFileAsync = util.promisify(fs.appendFile);

const filePath = "public_key.txt"; // Replace with the path to your file
const filePath1 = "balance.json";

async function getBalance(publicKeys) {
  try {
    const response = await axios.get(
      `https://blockchain.info/balance?active=${publicKeys}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  output: process.stdout,
  terminal: false,
});

let i = 0;
let publicKeys = [];

rl.on("line", async (line) => {
  // This callback function is called for each line in the file
  const data = JSON.parse(line);
  i++;
  publicKeys.push(data.publicKey); // Use data.publicKey instead of data['publicKey']
  console.log(i);
  if (i === 1000) {
    const keys = publicKeys.join("|");
    i = 0;
    publicKeys = [];
    try {
      const walletInfo = await getBalance(keys);
      await appendFileAsync(filePath1, JSON.stringify(walletInfo) + "\n");
    } catch (error) {
      console.error(error);
    }
  }
});

rl.on("close", () => {
  // This callback is called when the reading is finished or the reader is closed
  console.log("Finished reading lines.");
});
