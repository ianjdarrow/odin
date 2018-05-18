import { expect } from "chai";
import { shallow } from "@vue/test-utils";
import { mocks } from "mock-browser";
global.window = new mocks.MockBrowser().getWindow();
console.log(global.window.crypto);

import { encryptWallet, decryptWallet } from "../../src/util/crypto";

const mnemonic =
  "grief film peasant exotic under estate fence hover tornado holiday wild awake beauty wage convince three picture private wasp response chair armor lion opera";

describe("crypto utilities", () => {
  it("correctly encodes and decodes wallet files", async done => {
    const encrypted = await encryptWallet("test", "salt", mnemonic);
    console.log(encrypted);
    done();
  }).timeout(5000);
});
