const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Car = require("../Models/car");

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: API endpoints for managing cars.
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     tags: [Cars]
 *     summary: Get all cars
 *     description: Retrieve all cars from the database.
 *     responses:
 *       200:
 *         description: A list of cars.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
// GET all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     tags: [Cars]
 *     summary: Get a car by ID
 *     description: Retrieve a car from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the car
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The car data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found.
 */
// GET a car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/cars:
 *   post:
 *     tags: [Cars]
 *     summary: Create a new car
 *     description: Create a new car in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: The created car data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Bad request. Invalid input data.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 {
 *                   msg: "Category is required",
 *                   param: "category",
 *                   location: "body"
 *                 },
 *                 {
 *                   msg: "Color is required",
 *                   param: "color",
 *                   location: "body"
 *                 },
 *                 ...
 *               ]
 */

// POST create a new car
router.post(
  "/",
  [
    body("category").notEmpty().withMessage("Category is required"),
    body("color").notEmpty().withMessage("Color is required"),
    body("model").notEmpty().withMessage("Model is required"),
    body("make").notEmpty().withMessage("Make is required"),
    body("registrationNo")
      .notEmpty()
      .withMessage("Registration number is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const car = new Car(req.body);
      await car.save();

      res.status(201).json(car);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     tags: [Cars]
 *     summary: Update a car by ID
 *     description: Update a car in the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the car to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: The updated car data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Bad request. Invalid input data.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 {
 *                   msg: "Category is required",
 *                   param: "category",
 *                   location: "body"
 *                 },
 *                 {
 *                   msg: "Color is required",
 *                   param: "color",
 *                   location: "body"
 *                 },
 *                 ...
 *               ]
 *       404:
 *         description: Car not found.
 */

// PUT update a car by ID
router.put(
  "/:id",
  [
    body("category").notEmpty().withMessage("Category is required"),
    body("color").notEmpty().withMessage("Color is required"),
    body("model").notEmpty().withMessage("Model is required"),
    body("make").notEmpty().withMessage("Make is required"),
    body("registrationNo")
      .notEmpty()
      .withMessage("Registration number is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }

      res.status(200).json(car);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     tags: [Cars]
 *     summary: Delete a car by ID
 *     description: Delete a car from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the car to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully.
 *       404:
 *         description: Car not found.
 */

// DELETE a car by ID
router.delete("/:id", async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
