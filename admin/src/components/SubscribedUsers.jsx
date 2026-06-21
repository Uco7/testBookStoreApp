import React from "react";
import { MdDelete } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAdminSubscriptions } from "../context/Adminsubscriptioncontext";

function SubscribedUsers() {
  const {
    subscriptions = [],
    loading,
    deleteSubscription,
  } = useAdminSubscriptions();

  return (
    <div className="usermanagement-container">
      <div className="usermanagement-contents">

        <div className="serach-wrapper">
          <h2>Subscribed Users</h2>

          <div className="back-wrapper">
            <Link to="/">
              Back <FaArrowRight />
            </Link>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
          <thead>
  <tr>
    <th>S/N</th>
    <th>Full Name</th>
    <th>Username</th>
    <th>Email</th>
    <th>Plan</th>
    <th>Amount</th>
    <th>Reference</th>
    <th>Status</th>
    <th>Paid At</th>
    <th>Created At</th>
    <th>Updated At</th>
    <th>Action</th>
  </tr>
</thead>

            <tbody>
  {loading ? (
    <tr>
      <td colSpan="12">Loading...</td>
    </tr>
  ) : subscriptions.length === 0 ? (
    <tr>
      <td colSpan="12">No subscription records found</td>
    </tr>
  ) : (
    subscriptions.map((sub, index) => (
      <tr key={sub._id}>
        <td>{index + 1}</td>

        {/* User Details */}
        <td>{sub.userId?.fullName || "-"}</td>

        <td>{sub.userId?.username || "-"}</td>

        <td>{sub.userId?.email || sub.email}</td>

        {/* Subscription Details */}
        <td style={{ textTransform: "capitalize" }}>
          {sub.plan}
        </td>

        <td>₦{sub.amount?.toLocaleString()}</td>

        <td>{sub.reference}</td>

        <td>
          <span
            style={{
              color:
                sub.status === "success"
                  ? "green"
                  : "red",
              fontWeight: "bold",
            }}
          >
            {sub.status}
          </span>
        </td>

        <td>
          {sub.paidAt
            ? new Date(sub.paidAt).toLocaleString()
            : "-"}
        </td>

        <td>
          {new Date(sub.createdAt).toLocaleString()}
        </td>

        <td>
          {new Date(sub.updatedAt).toLocaleString()}
        </td>

        <td
          className="del"
          onClick={() => deleteSubscription?.(sub._id)}
        >
          <MdDelete />
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default SubscribedUsers;