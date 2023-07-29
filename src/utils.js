const { utils } = require("web3");
const ethUtil = require("ethereumjs-util");

const verifyMetaMaskSignature = (signedMessage, address, secretMessage) => {
  try {
    // Convert the secretMessage to a 0x-prefixed hexadecimal string
    const secretMessageHex = utils.utf8ToHex(secretMessage);

    // Hash the secretMessageHex
    const messageHash = utils.sha3(secretMessageHex);

    // Convert the messageHash to a Uint8Array
    const messageHashUint8 = ethUtil.toBuffer(messageHash);

    // Strip the 0x prefix from the signedMessage if it exists
    const strippedSignedMessage = signedMessage.startsWith("0x")
      ? signedMessage.slice(2)
      : signedMessage;

    // Convert the stripped signedMessage to a Buffer
    const signatureBuffer = Buffer.from(strippedSignedMessage, "hex");

    // Recover the signer's address from the signature
    const { v, r, s } = ethUtil.fromRpcSig(signatureBuffer);
    const pubKey = ethUtil.ecrecover(messageHashUint8, v, r, s);
    const recoveredAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey));

    console.log("Recovered Address:", recoveredAddress);
    console.log("comparing address", address);

    // Compare the recovered address with the provided address
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (err) {
    console.error("Error verifying MetaMask signature:", err);
    return false;
  }
};

module.exports = verifyMetaMaskSignature;
