const { ethers } = require("hardhat");

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorageFactory");
    const factory = await SimpleStorageFactory.deploy();
    await factory.deployed();
    console.log("Factory deployed to:", factory.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
