const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Skill = await hre.ethers.getContractFactory("Skill");
  const skill = await Skill.deploy();
  const deployed = await skill.deployed();

  const addressJson = JSON.stringify({
    Upload: deployed.address
  })

  fs.writeFileSync('./src/artifacts/addresses.json', addressJson)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
