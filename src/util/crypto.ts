import { mnemonicToSeed, entropyToMnemonic } from "bip39";
import bs58 from "bs58";
import { HDNode, networks } from "bitcoinjs-lib";
import scrypt from "scrypt-async";
import { Buffer } from "safe-buffer";

const scryptParams = {
  logN: 15,
  r: 8,
  p: 1,
  dkLen: 32
};

const stringToSha256 = (str: string): Promise<string> => {
  const arr: Uint8Array = new TextEncoder().encode(str);
  return new Promise(res => {
    window.crypto.subtle.digest({ name: "SHA-256" }, arr).then(hash => {
      res(bs58.encode(new Uint8Array(hash)));
    });
  });
};

const deriveKeyFromPassword = (
  password: string,
  salt: string,
  params: Object = scryptParams
): Promise<Uint8Array> => {
  return new Promise(res => {
    scrypt(
      // @ts-ignore
      password,
      salt,
      {
        ...params,
        encoding: "binary",
        interruptStep: 1024
      },
      (key: Uint8Array) => res(key)
    );
  });
};

const AESKeyFromArray = (key: Uint8Array): Promise<CryptoKey> => {
  return new Promise(res => {
    window.crypto.subtle
      .importKey("raw", key, "AES-GCM", false, ["encrypt", "decrypt"])
      .then(result => res(result));
  });
};

export const mnemonicToBuffer = (mnemonic: string): Promise<Uint8Array> => {
  return new Promise(res => {
    const seed = mnemonicToSeed(mnemonic);
    const node = HDNode.fromSeedBuffer(seed, networks.testnet);
    const string: string = node.toBase58();
    const buffer = bs58.decode(string);
    res(new Uint8Array(buffer));
  });
};

// in:  password string, raw salt string, mnemonic string
// out: encrypted wallet file as string
// encrypted wallet is stored as ?-delimited string with
//    scryptParams,
//    hex-encoded hashed salt for scrypt kdf,
//    hex-encoded iv for aes256 encryption,
//    hex-encoded encrypted seed

export const encryptWallet = (
  password: string,
  salt: string,
  mnemonic: string
): Promise<string> => {
  return new Promise(async res => {
    const hashedSalt = await stringToSha256(salt);
    const derived: Uint8Array = await deriveKeyFromPassword(
      password,
      hashedSalt
    );
    const key: CryptoKey = await AESKeyFromArray(derived);
    const data = await mnemonicToBuffer(mnemonic);
    let iv: Uint8Array = new Uint8Array(16);
    window.crypto.getRandomValues(iv);
    window.crypto.subtle
      .encrypt(
        {
          name: "AES-GCM",
          iv
        },
        key,
        data
      )
      .then(encrypted => {
        const elements = [
          JSON.stringify(scryptParams),
          hashedSalt,
          bs58.encode(iv),
          bs58.encode(new Uint8Array(encrypted))
        ].join("?");
        res(elements);
      });
  });
};

export const decryptWallet = (
  wallet: string,
  password: string
): Promise<HDNode> => {
  return new Promise(async res => {
    const [p, salt, textIv, textEncrypted] = wallet.split("?");
    const params = JSON.parse(p);
    const derived = await deriveKeyFromPassword(password, salt, params);
    const key = await AESKeyFromArray(derived);
    const iv = bs58.decode(textIv);
    const data = new Uint8Array(bs58.decode(textEncrypted));
    window.crypto.subtle
      .decrypt(
        {
          name: "AES-GCM",
          iv
        },
        key,
        data
      )
      .then(async decrypted => {
        const buffer = new Uint8Array(decrypted);
        const string = bs58.encode(buffer);
        const node = HDNode.fromBase58(string, networks.testnet);
        res(node);
      });
  });
};
