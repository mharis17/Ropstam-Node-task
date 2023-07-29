const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const CryptoUser = require("../Models/CryptoUser");
const mongoose = require("mongoose");
const { verifyMetaMaskSignature } = require("../utils");

/**
 * @swagger
 * tags:
 *   name: MetaMask
 *   description: API endpoints for MetaMask authentication.
 */

/**
 * @swagger
 * /api/metamask/getmessage:
 *   post:
 *     summary: Get random message to be signed by the user.
 *     description: Get a random message that the user needs to sign with MetaMask.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *             example:
 *               address: "0x123456789abcdef"
 *     responses:
 *       201:
 *         description: Random message generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Hello there!"
 *       400:
 *         description: Bad request or error while generating the message.
 */

//FIRTS Store an random nonce (message on the db) and send it to the front user to sign the message
router.post("/getmessage", async (req, res) => {
  const { address } = req.body;
  console.log(req.body, "sign");
  console.log(address, "address");

  // Generate a random message
  const randomMessages = [
    "Hello there!",
    "Just wanted to say hi!",
    "Have a great day!",
    "Greetings from the API!",
    "Wishing you all the best!",
  ];

  const randomMessage =
    randomMessages[Math.floor(Math.random() * randomMessages.length)];

  // Check if the user with the given address already exists in the database
  CryptoUser.findOne({ Address: address })
    .then((existingUser) => {
      if (existingUser) {
        // If the user exists, update their message
        existingUser.message = randomMessage;
        return existingUser.save();
      } else {
        // If the user doesn't exist, create a new user with the random message
        const newUser = new CryptoUser({
          _id: new mongoose.Types.ObjectId(),
          Address: address,
          message: randomMessage,
        });
        return newUser.save();
      }
    })
    .then(() => res.status(201).json({ message: randomMessage }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
});

/**
 * @swagger
 * /api/metamask/signin:
 *   post:
 *     summary: Sign in using MetaMask signature.
 *     description: Sign in the user by verifying the MetaMask signature.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               signedMessage:
 *                 type: string
 *               address:
 *                 type: string
 *             example:
 *               signedMessage: "0x123456789abcdef"
 *               address: "0xabcdef123456"
 *     responses:
 *       200:
 *         description: User signed in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *               example:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid signature or user not found.
 *       500:
 *         description: Error signing in with MetaMask.
 */

router.post("/signin", async (req, res) => {
  try {
    const { signedMessage, address } = req.body;
    console.log(req.body);
    // Find the user by address in  database
    const user = await CryptoUser.findOne({ address });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    console.log(user.message, "stored message");
    // Verify the MetaMask signature with the stored secret message
    const isSignatureValid = await verifyMetaMaskSignature(
      signedMessage,
      address,
      user.message
    );
    console.log(isSignatureValid, "abby kia ha");
    if (!isSignatureValid) {
      return res.status(401).json({ message: "Invalid signature." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { address: user.Address },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing in with MetaMask." });
  }
});

module.exports = router;
