import axios from 'axios';
import { BlockfrostProvider, MeshWallet, mnemonicToEntropy } from "@meshsdk/core";
import fs from 'fs';

const blockfrostProvider = new BlockfrostProvider(process.env.BLOCKFROST_API_KEY as string);

let json: any[] = [];
const HARDENED = 0x80000000;
const mnemonic = process.env.MNEMONIC!;
const entropyHex = mnemonicToEntropy(mnemonic);
let total: number = 0;

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
   
    const {data} = await axios.get(`https://scavenger.prod.gd.midnighttge.io/statistics/${address}`)



   
    total += Number(data?.local?.night_allocation) / 1_000_000;
    console.log(index + " = " +Number(data?.local?.night_allocation) / 1_000_000)
    json.push({
        account_index: index,
        address: address,
        night: Number(data?.local?.night_allocation) / 1_000_000
    });
}


fs.writeFileSync("./wallet.json", JSON.stringify(json, null, 4));
console.log(`✅ ${total} Night & File wallets.json đã tạo thành công !`);