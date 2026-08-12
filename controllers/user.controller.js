const userModel = require("../models/user.model");
const Booking = require("../models/reservation.model"); 
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const secretKey = process.env.JWT_SECRET || "mySecretKey";

// Helper to include the user's role in the JWT payload
const createToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    secretKey,
    { expiresIn: maxAge }
  );
};

/* =======================================================
    REGISTER USER (POST /api/auth/register)
======================================================= */
module.exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      adresse,
      role,
      numberOfChildren,
      specialRequirements,
      hourlyRate,
      experienceYears,
      hasBackgroundCheck,
    } = req.body;

    // 1. Basic validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "Please complete all required fields." });
    }

    // 2. Check if email already exists
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ error: "Email is already registered." });
    }

    // 3. Create user (password is automatically hashed by Mongoose schema pre('save') hook)
    const newUser = await userModel.create({
      name,
      email,
      password,
      phone,
      adresse,
      role: role || "parent",
      numberOfChildren: role === "parent" ? numberOfChildren : undefined,
      specialRequirements: role === "parent" ? specialRequirements : undefined,
      hourlyRate: role === "babysitter" ? hourlyRate : undefined,
      experienceYears: role === "babysitter" ? experienceYears : undefined,
      hasBackgroundCheck: role === "babysitter" ? hasBackgroundCheck : undefined,
    });

    const token = createToken(newUser._id, newUser.role);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: newUser,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =======================================================
    LOGIN (POST /api/auth/login)
======================================================= */
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.login(email, password);
    const token = createToken(user._id, user.role);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user,
      role: user.role,
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

/* =======================================================
    GET ALL BABYSITTERS (GET /api/babysitters)
======================================================= */
module.exports.getBabysitters = async (req, res) => {
  try {
    const { search, maxRate } = req.query;

    let query = { role: "babysitter", block: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { adresse: { $regex: search, $options: "i" } },
      ];
    }

    if (maxRate) {
      query.hourlyRate = { $lte: Number(maxRate) };
    }

    const sitters = await userModel.find(query).select("-password");

    res.status(200).json({
      message: "Babysitters fetched successfully",
      data: sitters,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =======================================================
    GET BABYSITTER BY ID (GET /api/babysitters/:id)
======================================================= */
module.exports.getBabysitterById = async (req, res) => {
  try {
    const sitter = await userModel.findById(req.params.id).select("-password");

    if (!sitter || sitter.role !== "babysitter") {
      return res.status(404).json({ error: "Babysitter not found" });
    }

    res.status(200).json({
      message: "Babysitter profile fetched successfully",
      data: sitter,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =======================================================
    CREATE BOOKING / RESERVATION (POST /api/bookings)
======================================================= */
module.exports.createBooking = async (req, res) => {
  try {
    const { parentId, sitterId, date, startTime, endTime, notes } = req.body;

    if (!parentId || !sitterId || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required booking fields." });
    }

    const sitter = await userModel.findById(sitterId);
    if (!sitter || sitter.role !== "babysitter") {
      return res.status(404).json({ error: "Babysitter not found." });
    }

    // Double-booking conflict check
    const conflict = await Booking.findOne({
      sitterId,
      date: new Date(date),
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (conflict) {
      return res.status(409).json({ error: "The sitter is already booked for this time slot." });
    }

    // Cost calculation
    const startHour = parseFloat(startTime.split(":")[0]) + parseFloat(startTime.split(":")[1]) / 60;
    const endHour = parseFloat(endTime.split(":")[0]) + parseFloat(endTime.split(":")[1]) / 60;
    const durationHours = Math.max(0, endHour - startHour);
    const totalCost = durationHours * (sitter.hourlyRate || 15);

    const booking = await Booking.create({
      parentId,
      sitterId,
      date: new Date(date),
      startTime,
      endTime,
      totalCost,
      notes,
      status: "pending",
    });

    res.status(201).json({
      message: "Booking request created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =======================================================
    GET ALL USERS
======================================================= */
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =======================================================
    GET USER BY ID
======================================================= */
module.exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =======================================================
    CREATE USER / ADMIN / UPDATE / DELETE
======================================================= */
module.exports.createUser = async (req, res) => {
  try {
    const newUser = await userModel.create(req.body);
    res.status(201).json({ message: "User created successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.createUserAdmin = async (req, res) => {
  try {
    const newUser = await userModel.create({ ...req.body, role: "admin" });
    res.status(201).json({ message: "Admin created successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.UpdateUser = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully", data: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.createUserWithImage = async (req, res) => {
  try {
    const newUser = new userModel({ ...req.body, image: req.file?.filename });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};