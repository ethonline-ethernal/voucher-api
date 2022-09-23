import config from "./config.json" assert { type: "json" };
import Factory_abi from "./factory_abi.json" assert { type: "json" };
import Voucher_abi from "./voucher_abi.json" assert { type: "json" };
import Tokengated_abi from "./tokengated_abi.json" assert { type: "json" };
import express from "express";
import { ethers } from "ethers";
import cors from "cors";

const app = express();
const provider = new ethers.providers.JsonRpcProvider(config.rpc.url);
const wallet = new ethers.Wallet(config.account.privatekey, provider);
const factory = new ethers.Contract(
  config.contracts.factory.address,
  Factory_abi,
  wallet
);

/**CORS SETTING */
var allowedOrigins = ["http://localhost:3000", "https://ethernal.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
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
            console.log("---------------------------------------");
            console.log("MINT => ", req.params["name"]);
            console.log("TO => ", req.params["address"]);
            console.log("TX LOGS => ", tx.hash);
          } catch (error) {
            console.log("MINT ERROR => " + req.params["address"]);
            return res.status(500).send(error);
          }
          if (tx != undefined) {
            return res
              .status(200)
              .json({ status: 200, message: "MINT Success", tx: tx.hash });
          }
        }
        mint();
      });
  } catch (e) {
    return res.status(500).send(e);
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
            console.log("---------------------------------------");
            console.log("REDEEN => ", req.params["name"]);
            console.log("ADDR => ", req.params["address"]);
            console.log("TX LOGS => ", tx.hash);
          } catch (e) {
            console.log("REDEEM ERROR => " + req.params["address"]);
            return res.status(500).send(e);
          }
          if (tx !== undefined) {
            return res
              .status(200)
              .json({ status: 200, message: "REDEEM Success", tx: tx.hash });
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
            return res.status(500).send(e);
          }
          if (tx != undefined) {
            return res
              .status(200)
              .json({ status: 200, message: "MINT Success", tx: tx.hash });
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
            return res.status(500).send(e);
          }
          if (tx != undefined) {
            return res
              .status(200)
              .json({ status: 200, message: "REDEEM Success", tx: tx.hash });
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
