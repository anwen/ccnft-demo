const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.getContractFactory("NFT");
  const CONTRACT_ADDRESS = "0x4f31ED74546A4Ca53e65A7f0E649D08DAD0E1575"
  const contract = NFT.attach(CONTRACT_ADDRESS);
  const owner = await contract.ownerOf(1);
  console.log("Owner:", owner);
  const uri = await contract.tokenURI(1);
  console.log("URI: ", uri);
}
main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});