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

app.post("/mint/:name/:address", (req, res) => {
  try {
    const result = factory
      .getVoucherAddress(req.params["name"])
      .then((address) => {
        const Voucher = new ethers.Contract(address, Voucher_abi, wallet);
        async function mint() {
          let tx = undefined;
          try {
            tx = await Voucher.mint(req.params["address"]);
          } catch (error) {
            res.status(500).send(e);
          }
          if (tx != undefined) {
            res.send("Transaction hash :" + tx.hash);
          }
        }
        mint();
      });
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/redeem/:name/:address", (req, res) => {
  try {
    const result = factory
      .getVoucherAddress(req.params["name"])
      .then((address) => {
        const Voucher = new ethers.Contract(address, Voucher_abi, wallet);
        async function redeem() {
          let tx = undefined;
          try {
            tx = await Voucher.redeem(req.params["address"]);
          } catch (e) {
            res.status(500).send(e);
          }
          if (tx !== undefined) {
            res.send("Transaction hash :" + tx.hash);
          }
        }
        redeem();
      });
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/mint/:name/:address/:tokenid", (req, res) => {
  try {
    const result = factory
      .getVoucherAddress(req.params["name"])
      .then((address) => {
        const Voucher = new ethers.Contract(address, Tokengated_abi, wallet);
        async function mint() {
          let tx = undefined;
          try {
            tx = await Voucher.mint(
              req.params["address"],
              req.params["tokenid"]
            );
          } catch (e) {
            res.status(500).send(e);
          }
          if (tx != undefined) {
            res.send("Transaction hash :" + tx.hash);
          }
        }
        mint();
      });
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/redeem/:name/:address/:tokenid", (req, res) => {
  try {
    const result = factory
      .getVoucherAddress(req.params["name"])
      .then((address) => {
        const Voucher = new ethers.Contract(address, Tokengated_abi, wallet);
        async function redeem() {
          let tx = undefined;
          try {
            tx = await Voucher.redeem(
              req.params["address"],
              req.params["tokenid"]
            );
          } catch (e) {
            res.status(500).send(e);
          }
          if (tx != undefined) {
            res.send("Transaction hash :" + tx.hash);
          }
        }
        redeem();
      });
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(3000, () => {
  console.log("Start server at port 3000.");
});
