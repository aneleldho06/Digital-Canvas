import { ethers } from "hardhat";

async function main() {
    const DigitalCanvas = await ethers.getContractFactory("DigitalCanvas");
    const canvas = await DigitalCanvas.deploy();

    await canvas.waitForDeployment();

    console.log(`DigitalCanvas deployed to ${await canvas.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
