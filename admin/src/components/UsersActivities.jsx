import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AdminuseUsers } from "../context/AdminuserContext";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString();
};

const formatLastSeen = (dateStr) => {
  if (!dateStr) return "never";

  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diffSec < 60) return "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
};

function UsersActivities() {
  const {
    users = [],
    stats = {
      totalUsers: 0,
      onlineUsers: 0,
      offlineUsers: 0,
    },
    loading,
    error,
    refreshUsers,
    refreshActivityStats,
  } = AdminuseUsers();

  const handleRefresh = () => {
    refreshUsers?.();
    refreshActivityStats?.();
  };

  return (
    <div className="usermanagement-container">
      <div className="usermanagement-contents">

        <div className="serach-wrapper">
          <h2>Users Activity</h2>

          <div className="back-wrapper">
            <span
              onClick={handleRefresh}
              style={{ cursor: "pointer", marginRight: 16 }}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </span>

            <Link to="/">
              Back <FaArrowRight />
            </Link>
          </div>
        </div>

        <p>
          {stats.totalUsers} total · {stats.onlineUsers} online ·{" "}
          {stats.offlineUsers} offline
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Plan</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="8">No user records found</td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const isOnline = user?.activityStatus?.isOnline === true;
                  const lastSeen = user?.activityStatus?.lastSeen;
                  const isPremium = user?.premium?.isPremium === true;

                  return (
                    <tr key={user._id}>
                      <td>{index + 1}</td>

                      <td>{user.fullName || "-"}</td>

                      <td>{user.username || "-"}</td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          style={{
                            color: isOnline ? "green" : "gray",
                            fontWeight: "bold",
                          }}
                        >
                          {isOnline
                            ? "Online"
                            : `Offline (${formatLastSeen(lastSeen)})`}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            color: user.isVerified ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>

                      <td style={{ textTransform: "capitalize" }}>
                        {isPremium
                          ? user?.premium?.premiumPlan || "Premium"
                          : "Free"}
                      </td>

                      <td>{formatDate(user.createdAt)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default UsersActivities;