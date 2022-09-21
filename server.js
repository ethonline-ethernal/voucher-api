import config from "./config.json" assert { type: "json" };
import Factory_abi from "./factory_abi.json" assert { type: "json" };
import Voucher_abi from "./voucher_abi.json" assert { type: "json" };
import express from "express";
import { ethers } from "ethers";

const app = express();
const provider = new ethers.providers.JsonRpcProvider(config.rpc.url);
const wallet = new ethers.Wallet(config.account.privatekey, provider);
const factory = new ethers.Contract(
  config.contracts.factory.address,
  Factory_abi,
  wallet
);

app.get("/address", (req, res) => {
  const result = factory.getVoucherAddress("Alice").then((address) => {
    const Voucher = new ethers.Contract(address, Voucher_abi, wallet);
    const name = Voucher.name().then((name) => {
      res.send("Name : " + name);
    });
  });
});

app.post("/mint", (req, res) => {
  const result = factory.getVoucherAddress("Alice").then((address) => {
    const Voucher = new ethers.Contract(address, Voucher_abi, wallet);
    const mint = Voucher.mint(config.account.address);
    console.log(mint);
    res.send("Minted");
  });
});

app.post("/redeem", (req, res) => {
  const result = factory.getVoucherAddress("Alice").then((address) => {
    const Voucher = new ethers.Contract(address, Voucher_abi, wallet);
    const redeem = Voucher.redeem(config.account.address);
    console.log(redeem);
    res.send("Redeemed");
  });
});

app.listen(3000, () => {
  console.log("Start server at port 3000.");
});
