import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function CreateNotice() {
  return (
    <div className="notice-container">

      <div className="notice-wrapper">

        <form className='notice-form'>

          <div className="notice-header">
            <h3>Create Users Notice</h3>

            <div className="back-btn">
              <Link to='/'>
                Back <FaArrowRight />
              </Link>
            </div>
          </div>

          <div className="form-group">
            <label>Notice Title</label>

            <input
              type="text"
              placeholder='Enter notice title'
            />
          </div>

          <div className="form-group">
            <label>Notice Type</label>

            <select>
              <option value="">Select notice type</option>
              <option value="general">General Notice</option>
              <option value="warning">Warning</option>
              <option value="update">Update</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Users</label>

            <select>
              <option value="">All Users</option>
              <option value="verified">Verified Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notice Message</label>

            <textarea
              rows="7"
              placeholder='Write your notice here...'
            ></textarea>
          </div>

          <div className="form-group checkbox-wrapper">
            <input type="checkbox" id='emailNotice' />

            <label htmlFor="emailNotice">
              Send as Email Notification
            </label>
          </div>

          <button className='send-btn'>
            Send Notice
          </button>

        </form>

      </div>

    </div>
  )
}