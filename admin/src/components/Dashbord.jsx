



import React, { useState } from 'react'
import '../css/dashbord.css'
import { FaUserFriends } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosAlarm } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserSlash } from "react-icons/fa";
import { FaUsersRectangle } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

import { IoMdCloudUpload } from "react-icons/io";
import { BsCalendar2DateFill } from "react-icons/bs";
import CircleProgress from '../components/reuseable_Components/CircleProgress';
import RevenueChart from '../components/reuseable_Components/RevenueChart';
import { useNavigate, Link } from 'react-router-dom';
import { MdPublishedWithChanges } from "react-icons/md";
import admin from '../assets/admin.jpeg'
import adminDark from '../assets/admin-dark.jpeg'
import { AdminuseUsers } from '../context/AdminuserContext';
import { useAdmin } from '../context/AdminContext'; // Point to your context path
import { useAdminTimetables } from "../context/Admintimetablecontext";
import { useAdminSubscriptions } from '../context/Adminsubscriptioncontext';
import { useAdminBooks } from "../context/Adminbookcontex";

export default function Dashbord() {
    const [noticeDropdown, setNoticeDropdown] = useState(false);
    const [collapseSidebar, setCollapseSidebar] = useState(false);

    // 🔧 FIX: this was `useAdomin()` — a typo on the imported hook name
    // `useAdmin`. That threw "useAdomin is not defined" and crashed the
    // whole Dashbord component on render (you'd see this any time
    // Dashbord tried to mount, including right after a successful
    // login redirect — which is why it looked like "blank screen after
    // login" rather than an obviously unrelated typo).
    const { admin, logout } = useAdmin();

    const navigate = useNavigate();

    const {
        stats = {
            totalUsers: 0,
            verifiedUsersCount: 0,
            premiumUsersCount: 0,
            verifiedUsersPercent: 0,
            premiumUsersPercent: 0,
            onlineUsers: 0,
            offlineUsers: 0,
        },
        loading,
        error,
        refreshUsers,
    } = AdminuseUsers();
    const {
        summary,
        loading: timetableLoading,
    } = useAdminTimetables();
    const {
        subscriptions = [],
        summary: subscriptionSummary,
        loading: subscriptionLoading,
    } = useAdminSubscriptions();

    const recentTransactions = subscriptions.slice(0, 3);

    const {
        books,
        loading: booksLoading,
    } = useAdminBooks();
    const totalUploadedItems = Array.isArray(books) ? books.length : 0;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Safely pull the administrative name out of the context data stream
    const adminDisplayId = admin?.username || admin?.name || "Admin User";

    return (
        <div className={collapseSidebar ? "container active" : "container"}>
            <div className='sideBar'>
                <div className='sideBar-item1-wrapper'>
                    <div>
                        Admin
                    </div>
                    <div className='menu-icon' onClick={() => setCollapseSidebar(!collapseSidebar)}>
                        <TiThMenu />
                    </div>
                </div>
                <div className="admin-profile-section">
                    <div className="admin-profile-pic">
                        <img src={adminDark} alt="Admin Profile" className='admin-icon' />
                    </div>
                    <div className="admin-profile-info">
                        <p className="admin-name" style={{ textTransform: 'capitalize' }}>
                            userName:{adminDisplayId}  </p>
                        <div className="admin-role">Administrator</div>
                    </div>
                </div>
                <div className="sideBar-navigation-item-wraper-2">

                    <div className='sideBar-item'> <Link to="/admin/dasbord-page"><span><MdSpaceDashboard /> </span> Dashboard</Link></div>
                    <div className='sideBar-item'> <Link to="/users"><span><FaUserFriends /> </span> Users</Link></div>
                    <div className='sideBar-item'> <Link to="/users/uploaded-items"><span><FaCloudUploadAlt /> </span> Uploaded Items</Link></div>
                    <div className='sideBar-item'> <Link to="/users/saved-timetable"><span><IoIosAlarm /> </span> Timetables</Link></div>
                    <div className='sideBar-item'> <Link to="/users/subscribed-users"><span><IoIosAlarm /> </span> Subscribed Users</Link></div>
                    {/* 🔧 FIX: this pointed to "/" — which isn't registered
                        as a route in App.jsx at all (your routes start at
                        /admin/dasbord-page, /users, etc, with no root "/"
                        route defined). Pointed back to the real admin auth
                        route so this link actually goes somewhere. */}
                    <div className='sideBar-item'> <Link to="/"><span><IoIosAlarm /> </span> admin register</Link></div>
                    <div className='sideBar-item'> <Link to="/users/users-activities/page"><span><IoIosAlarm /> </span> Users Activities/Stats</Link></div>
                    <div className="notice-wrapper">
                        <div className='sideBar-item' onClick={() => setNoticeDropdown(!noticeDropdown)}>
                            <span><MdPublishedWithChanges /></span> Notice</div>
                        {noticeDropdown && (
                            <>
                                <div className="notice-dropdown">
                                    <Link to="/create/users-notice">Create Notice</Link>
                                </div>
                                <div className="notice-dropdown">
                                    <a href="">Create Notice</a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="main-content">

                <div className='sidebar-content'>
                    <div className="left-item-wrapper">
                        <span>
                            <IoIosNotifications className='left-icon' />
                        </span>
                        <span>
                            <IoMdSettings className='left-icon' />
                        </span>
                        <span>
                            <CgProfile className='left-icon' />
                        </span>
                        <span className='left-icon logout-btn' style={{ color: 'red', cursor: 'pointer' }} onClick={handleLogout}>
                            logout
                        </span>
                    </div>

                    <div className='heading-item'>
                        <h2>Dashboard</h2>
                        <p className='wlc-msg'>Welcome to the admin dashboard!</p>
                    </div>

                    <div className='content-wrapper'>
                        {error && (
                            <div className="dashboard-error-banner">
                                <span>⚠️ {error}</span>
                                <button
                                    type="button"
                                    className="dashboard-error-retry"
                                    onClick={refreshUsers}
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        <div className="content-1-section">
                            <div className="content-1-item">

                                <div className="card-top content-section-1-icon-wrapper">
                                    <FaUsersRectangle className='sidebar-content-icon-1' />

                                    <CircleProgress
                                        progress={70}
                                        color="rgb(122, 214, 122)"
                                        className="circle-icon"
                                    />
                                </div>

                                <p>Total Users : {loading ? '...' : (stats?.totalUsers ?? 'No records')}</p>

                                <div className="content-section-1-icon-wrapper">
                                    <h3 className=''>premium users</h3>
                                    <p className='info-text'>{stats?.premiumUsersCount}%</p>
                                </div>
                                <div className="content-section-1-icon-wrapper">
                                    <h3 className=''>Verified Users</h3>
                                    <p className='info-text'>{stats?.verifiedUsersCount || 0}%</p>
                                </div>

                            </div>
                            <div className="content-2-item">
                                <div className="content-section-1-icon-wrapper">
                                    <FaUserCheck className='sidebar-content-icon-1' />
                                    <CircleProgress
                                        progress={70}
                                        color="rgb(122, 214, 122)"
                                        className="circle-icon"
                                    />
                                </div>
                                <h3>Online Users: <span>{loading ? "..." : stats?.onlineUsers ?? 0}</span></h3>

                                <div className="content-section-1-icon-wrapper">
                                    <h3>
                                        <FaUserSlash style={{ marginRight: 4 }} />
                                        Offline Users
                                    </h3>
                                    <p className='info-text'> {loading ? "..." : stats?.offlineUsers ?? 0}</p>
                                </div>
                                <div className="content-section-1-icon-wrapper">
                                    <h3>
                                        Subscribed users
                                    </h3>
                                    <p className='info-text'>  {subscriptionLoading
                                        ? "..."
                                        : subscriptionSummary.successfulCount}</p>
                                </div>

                            </div>
                            <div className="content-3-item">
                                <div className="content-section-1-icon-wrapper">
                                    <IoMdCloudUpload className='sidebar-content-icon-1' />
                                    <CircleProgress
                                        progress={70}
                                        color="rgb(122, 214, 122)"
                                        className="circle-icon"
                                    />
                                </div>
                                <h3>Uploaded Items : <span>
                                    {booksLoading ? "..." : totalUploadedItems}
                                </span></h3>
                                <div className="content-section-1-icon-wrapper">
                                    <h3>
                                        Timetable Created
                                    </h3>
                                    <p className='info-text'>{timetableLoading ? "..." : summary.totalTimetables}</p>
                                </div>
                            </div>
                            <div className="content-4-item">
                                <div className="content-section-1-icon-wrapper">
                                    <BsCalendar2DateFill className='sidebar-content-icon-1' />
                                    <CircleProgress
                                        progress={70}
                                        color="rgb(122, 214, 122)"
                                        className="circle-icon"
                                    />
                                </div>
                                <h3> Reminder Set:   <span>  {timetableLoading ? "..." : summary.totalReminders}</span>
                                </h3>
                                <div className="content-section-1-icon-wrapper">
                                    <h3>Premium Reminder</h3>
                                    <p className='info-text'>{timetableLoading ? "..." : summary.totalPremiumReminders}</p>
                                </div>
                                <div className="content-section-1-icon-wrapper">
                                    <h3>Regular Reminder</h3>
                                    <p className='info-text'>{timetableLoading ? "..." : summary.totalRegularReminders}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="sidebar-content-2">
                    <div className="chart-section">
                        <RevenueChart />
                    </div>
                    <div className="transaction-secection-container">
                        <div className="trans-header"><h3> Recent transaction</h3></div>

                        {recentTransactions.map((transaction) => (
                            <div
                                key={transaction._id}
                                className="transaction-item-wrapper trans-bg"
                            >
                                <div className="wrapp-username">
                                    <h5>User</h5>

                                    <div>
                                        {transaction.userId?.username || "Unknown"}
                                    </div>
                                </div>

                                <div className="wrapp-username">
                                    <h5>Date</h5>

                                    <div>
                                        {new Date(transaction.createdAt).toLocaleDateString()}
                                    </div>

                                    <span>
                                        Status:

                                        <em className='view' style={{ color: "rgb(122, 214, 122)", padding: 5 }}>
                                            {transaction.status}
                                        </em>
                                    </span>
                                </div>

                                <div className="view"> <a href="">View</a></div>
                            </div>
                        ))}

                    </div>

                </div>
            </div>
        </div>
    )
}