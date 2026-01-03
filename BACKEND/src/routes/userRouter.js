const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

// Define safe user data fields to be returned
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400).send("ERROR: " + err.message);
  }
});

// Get all connection requests sent by LoggedIn user
userRouter.get("/user/requests/sent", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequestsByUser = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate("toUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequestsByUser,
    });
  } catch (err) {
    req.statusCode(400).send("ERROR: " + err.message);
  }
});

// Get all the connections for the loggedIn user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Define safe user data fields to be returned
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Remove/Delete a connection by other user's ID
userRouter.delete("/user/connections/:userId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const otherUserId = req.params.userId;

    // Find the connection request between the two users
    const connectionRequest = await ConnectionRequest.findOne({
      status: "accepted",
      $or: [
        { fromUserId: loggedInUser._id, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: loggedInUser._id },
      ],
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Delete the connection request
    await ConnectionRequest.findByIdAndDelete(connectionRequest._id);

    res.json({ message: "Connection removed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user feed excluding users with pending/accepted connection requests
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Any interaction = hide from feed
    const allRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserIds = new Set();
    allRequests.forEach((r) => {
      hideUserIds.add(r.fromUserId.toString());
      hideUserIds.add(r.toUserId.toString());
    });

    const users = await User.find({
      _id: {
        $nin: [...hideUserIds, loggedInUser._id],
      },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search API
userRouter.get("/search", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const q = req.query.q?.trim();

    if (!q) return res.json({ data: [] });

    // Exclude ONLY pending & accepted
    const blockedRequests = await ConnectionRequest.find({
      status: { $in: ["pending", "accepted"] },
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const excludeUserIds = new Set();
    blockedRequests.forEach((r) => {
      excludeUserIds.add(r.fromUserId.toString());
      excludeUserIds.add(r.toUserId.toString());
    });

    const users = await User.find({
      _id: {
        $nin: [...excludeUserIds, loggedInUser._id],
      },
      $or: [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
      ],
    }).select(USER_SAFE_DATA);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
