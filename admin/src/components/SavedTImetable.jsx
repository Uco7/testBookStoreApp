import React from "react";
import { MdDelete } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAdminTimetables } from "../context/Admintimetablecontext";

export default function SavedTImetable  ()  {
  const {
    timetables,
    loading,
    deleteTimetable,
  } = useAdminTimetables();

  return (
    <div className="usermanagement-container">
      <div className="usermanagement-contents">

        <div className="serach-wrapper">
          <h2>Saved Timetables</h2>

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
                <th>User Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Book Title</th>
                <th>Plan</th>
                <th>Mode</th>
                <th>Reminder Time</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12">Loading...</td>
                </tr>
              ) : timetables?.length === 0 ? (
                <tr>
                  <td colSpan="12">No timetable records found</td>
                </tr>
              ) : (
                timetables.map((timetable, index) => (
                  <tr key={timetable._id}>
                    <td>{index + 1}</td>

                    <td>
                      {timetable.userId?.fullName || "-"}
                    </td>

                    <td>
                      {timetable.userId?.username || "-"}
                    </td>

                    <td>
                      {timetable.userId?.email || "-"}
                    </td>

                    <td>
                      {timetable.bookId?.title || "-"}
                    </td>

                    <td>
                      {timetable.planType}
                    </td>

                    <td>
                      {timetable.mode}
                    </td>

                    <td>
                      {timetable.reminderTime}
                    </td>

                    <td>
                      {timetable.isActive ? (
                        <span style={{ color: "green" }}>
                          Active
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>
                          Stopped
                        </span>
                      )}
                    </td>

                    <td>
                      {new Date(
                        timetable.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(
                        timetable.updatedAt
                      ).toLocaleDateString()}
                    </td>

                    <td
                      className="del"
                      onClick={() =>
                        deleteTimetable(timetable._id)
                      }
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
};