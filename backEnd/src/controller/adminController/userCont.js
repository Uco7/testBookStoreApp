// 1. Ensure your import casing matches how you use it below
import User from "../../models/user.js"; 

export const getallUsers = async (req, res) => {
    try {
        // 2. Correct way to fetch and sort by newest first in Mongoose
        // We also exclude passwords from being sent to the frontend for security
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        // 3. Check length because an empty find() returns []
        if (users.length === 0) {
            return res.status(404).json({
                message: "No User Record found"
            });
        }

        console.log("Fetched users successfully:", users.length);
        
        // 4. Return the data
        res.json(users);

    } catch (err) {
        console.error("Get All Users Error:", err);
        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
};
/* ---------- Get Online / Offline User Counts ---------- */
// Returns a simple stats object you can drop straight into a dashboard:
// { totalUsers, onlineUsers, offlineUsers }
export const getUserActivityStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const onlineUsers = await User.countDocuments({ "activityStatus.isOnline": true });
        const offlineUsers = totalUsers - onlineUsers;
 
        res.status(200).json({
            totalUsers,
            onlineUsers,
            offlineUsers
        });
 
    } catch (err) {
        console.error("Get User Activity Stats Error:", err);
        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
};

/* ---------- Get Single User by ID ---------- */
export const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID and omit the password for security
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (err) {
        console.error("Get Single User Error:", err);
        
        // Handle invalid MongoDB ObjectId formatting errors gracefully
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
};


/* ---------- Delete User by ID ---------- */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the user document in one step
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found or already deleted"
            });
        }

        res.status(200).json({
            message: `User '${deletedUser.username}' has been successfully deleted.`
        });

    } catch (err) {
        console.error("Delete User Error:", err);

        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
};