import config from "./config.json" assert { type: "json" };
import Factory_abi from "./factory_abi.json" assert { type: "json" };
import Voucher_abi from "./voucher_abi.json" assert { type: "json" };
import Tokengated_abi from "./tokengated_abi.json" assert { type: "json" };
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

app.get("/address/:name", (req, res) => {
  const result = factory
    .getVoucherAddress(req.params["name"])
    .then((address) => {
      res.send(req.params["name"] + " Voucher Address : " + address);
    });
});

app.post("/mint/:name/:address", (req, res) => {
  const result = factory
    .getVoucherAddress(req.params["name"])
    .then((address) => {
      const Voucher = new ethers.Contract(address, Voucher_abi, wallet);
      async function mint() {
        const tx = await Voucher.mint(req.params["address"]);
        res.send("Transaction hash :" + tx.hash);
      }
      mint();
    });
});

app.post("/redeem/:name/:address", (req, res) => {
  const result = factory
    .getVoucherAddress(req.params["name"])
    .then((address) => {
      const Voucher = new ethers.Contract(address, Voucher_abi, wallet);
      async function redeem() {
        const tx = await Voucher.redeem(req.params["address"]);
        res.send("Transaction hash :" + tx.hash);
      }
      redeem();
    });
});

app.post("/mint/:name/:address/:tokenid", (req, res) => {
  const result = factory
    .getVoucherAddress(req.params["name"])
    .then((address) => {
      const Voucher = new ethers.Contract(address, Tokengated_abi, wallet);
      async function mint() {
        const tx = await Voucher.mint(
          req.params["address"],
          req.params["tokenid"]
        );
        res.send("Transaction hash :" + tx.hash);
      }
      mint();
    });
});

app.post("/redeem/:name/:address/:tokenid", (req, res) => {
  const result = factory
    .getVoucherAddress(req.params["name"])
    .then((address) => {
      const Voucher = new ethers.Contract(address, Tokengated_abi, wallet);
      async function redeem() {
        const tx = await Voucher.redeem(
          req.params["address"],
          req.params["tokenid"]
        );
        res.send("Transaction hash :" + tx.hash);
      }
      redeem();
    });
});

app.listen(3000, () => {
  console.log("Start server at port 3000.");
});
