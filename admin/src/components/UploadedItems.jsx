import React from 'react'
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAdminBooks } from "../context/Adminbookcontex";





export default function Users() {
    const {
  books,
  loading,
  error,
  deleteBook,
} = useAdminBooks();
  return (
    <div className="usermanagement-container">
        <div className="usermanagement-contents">
            <div className="serach-wrapper">
            <input type="text" name="" id="" placeholder='sort/search users data' />
            <div className="search-icon-wrapper"> 
                <CiSearch  className='search-icon' />


            </div>
            <div className="back-wrapper">
                <Link to='/'> 
                    Back <FaArrowRight />


                </Link>
            </div>
        </div>
        <div className="table-wrapper">
            <table>
                    <thead>
  <tr>
    <th>S/N</th>
    <th>File Title</th>
    <th>Author</th>
    <th>File Type</th>
    <th>Uploaded By</th>
    <th>Username</th>
    <th>User Type</th>
    <th>Created Timetable</th>
    <th>Uploaded Date</th>
    <th>Updated Date</th>
    <th>Action</th>
  </tr>
</thead>
<tbody>
  {loading ? (
    <tr>
      <td colSpan="11">Loading...</td>
    </tr>
  ) : books.length === 0 ? (
    <tr>
      <td colSpan="11">No uploaded items found</td>
    </tr>
  ) : (
    books.map((book, index) => (
      <tr key={book._id}>
        {/* S/N */}
        <td>{index + 1}</td>

        {/* File Title */}
        <td>{book.title || "-"}</td>

        {/* Author */}
        <td>{book.author || "-"}</td>

        {/* File Type */}
        <td>{book.fileType || book.category || "-"}</td>

        {/* Uploaded By */}
        <td>{book.user?.fullName || "-"}</td>

        {/* Username */}
        <td>{book.user?.username || "-"}</td>

        {/* User Type */}
        <td>
          {book.user?.premium?.isPremium ? (
            <span style={{ color: "green", fontWeight: "bold" }}>
              Premium
            </span>
          ) : (
            <span style={{ color: "orange" }}>
              Regular
            </span>
          )}
        </td>

        {/* Timetable */}
        <td>
          {book.hasTimetable ? (
            <span style={{ color: "green" }}>Yes</span>
          ) : (
            <span style={{ color: "red" }}>No</span>
          )}
        </td>

        {/* Upload Date */}
        <td>
          {book.createdAt
            ? new Date(book.createdAt).toLocaleDateString()
            : "-"}
        </td>

        {/* Updated Date */}
        <td>
          {book.updatedAt
            ? new Date(book.updatedAt).toLocaleDateString()
            : "-"}
        </td>

        {/* Delete */}
        <td
          className="del"
          onClick={() => deleteBook(book._id)}
          style={{ cursor: "pointer" }}
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
    
  )
}
