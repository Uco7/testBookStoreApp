import React from 'react'
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';





export default function Users() {
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
                        <th>S/n</th>
                        <th>FullName</th>
                        <th>userName</th>
                        <th>userName</th>
                        <th>userName</th>
                        <th>userName</th>
                        <th className='action-th' colSpan={1}>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            1
                        </td>
                        <td>uche</td>
                        <td>uche</td>
                        <td>uche</td>
                        <td>uche</td>
                        <td>uche</td>
                        <td className='del'><MdDelete />
                            </td>
                        {/* <td>Notify</td> */}
                    </tr>
                    <tr>
                        <td>
                            1
                        </td>
                        <td>uche</td>
                        <td>uche</td>
                        <td>uche</td>
                        <td>uche</td>
                        <td>uche</td>
                    </tr>
                    <tr>
                        <td>
                            1
                        </td>
                        <td>uche</td>
                        <td>uche</td>
                        <td>uche</td>
                        <td>uche</td>
                        <td>uche</td>
                    </tr>
                </tbody>
            </table>
        </div>

        </div>
        
    </div>
    
  )
}
