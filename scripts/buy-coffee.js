// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

// returns the ether balance of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// logs the ether balance for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address: ${idx} balance-> `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memos.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) msg: "${message}"`);
  }
}

async function main() {
  // get example account
  const [owner, tipper, tipper1, tipper2] = await hre.ethers.getSigners();

  //get the contract to deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("buyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee Deployed to ", buyMeACoffee.address);

  // check balances before the purchase
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== *Start* ==");
  await printBalances(addresses);

  //buy the owner coffee
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper).buyCoffe("Bigi", "whatever menh", tip);
  await buyMeACoffee.connect(tipper1).buyCoffe("Kay", "chineke lee!", tip);
  await buyMeACoffee.connect(tipper2).buyCoffe("Tope", "nft nko!", tip);

  // check balance after the purchase
  console.log("== *bought coffee* ==");
  await printBalances(addresses);

  // withdraw tips
  await buyMeACoffee.connect(owner).withdrawTips();
  console.log("== *tips withdrawen* ==");
  await printBalances(addresses);

  // read all memos
  console.log("== *memos* ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);

 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
