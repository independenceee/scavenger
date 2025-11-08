import axios from 'axios';
import { BlockfrostProvider, MeshWallet, mnemonicToEntropy } from "@meshsdk/core";
import fs from 'fs';
import { Bip32PrivateKey } from '@emurgo/cardano-serialization-lib-nodejs';

const blockfrostProvider = new BlockfrostProvider(process.env.BLOCKFROST_API_KEY as string);
const destination = process.env.DESTINATION_WALLETADDRESS as string

let json: any = {};

const HARDENED = 0x80000000;
const mnemonic = process.env.MNEMONIC!;
const entropyHex = mnemonicToEntropy(mnemonic);
const entropy = Buffer.from(entropyHex, "hex");
const pwd = new Uint8Array(); 


for(let index = Number(process.env.ACCOUNT_INDEX_START); index < (Number(process.env.AMOUNT_ACCOUNT)+ Number(process.env.ACCOUNT_INDEX_START)); index ++) {

    const meshWallet = new MeshWallet({
        networkId: 1,
        accountIndex: index,
        fetcher: blockfrostProvider,
        submitter: blockfrostProvider,
        key: {
            type: "mnemonic",
            words: mnemonic.split(" "),
        },
    });
    
    const address = await meshWallet.getChangeAddress();

    // const signature  = await meshWallet.signData(
    //     Buffer.from(`Assign accumulated Scavenger rights to: ${destination}`).toString("utf-8")
    // );


    const message = `Assign accumulated Scavenger rights to: ${destination}`;
    const messageHex = Buffer.from(message, "utf8").toString("hex");
    const signature = await meshWallet.signData(messageHex);

    const rootKey = Bip32PrivateKey.from_bip39_entropy(entropy, pwd);

    const accountKey = rootKey
        .derive(1852 | HARDENED)
        .derive(1815 | HARDENED)
        .derive(index | HARDENED);

    const paymentKey = accountKey
        .derive(0)
        .derive(0);

    const pubKeyHex = Buffer
        .from(paymentKey.to_public().to_raw_key().as_bytes())
        .toString("hex");

    console.log("Account:", index);
    console.log("Address:", address);
    console.log("Public Key:", pubKeyHex);
    console.log("Signature:", signature.signature);
    const {data: night} = await axios.get(`https://scavenger.prod.gd.midnighttge.io/statistics/${address}`)
    console.log(+Number(night?.local?.night_allocation) / 1_000_000)

    break
    const {data} = await axios.post(
        `${process.env.BASE_URL}/donate_to/${destination}/${address}/${signature.signature}`,
        {}, 
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    
   

    console.log(data)    
    break
}


fs.writeFileSync("./challenges.json", JSON.stringify(json, null, 4));
console.log("✅ File wallets.json đã tạo thành công!");