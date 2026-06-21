import React, { useState, useMemo } from 'react'
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AdminuseUsers } from '../context/AdminuserContext';
import { BASE_URL } from '../middleWare/urlConfig';

export default function Users() {
  const { users, loading, error, refreshUsers } = AdminuseUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // ── SEARCH / FILTER ────────────────────────────────────────────────────
  // Filters client-side against the data we already have from context,
  // rather than re-fetching per keystroke. Fine for admin-scale user lists;
  // if this list grows into the thousands, this is the first thing to move
  // server-side (a ?search= query param on /api/admin/users).
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const q = searchTerm.trim().toLowerCase();
    return users.filter((u) => {
      const fullName = (u.fullName || '').toLowerCase();
      const username = (u.username || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      return fullName.includes(q) || username.includes(q) || email.includes(q);
    });
  }, [users, searchTerm]);

  // ── DELETE USER ─────────────────────────────────────────────────────────
  const handleDelete = async (id, label) => {
    const confirmed = window.confirm(`Delete user "${label}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeleteError('');
    setDeletingId(id);

    try {
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${BASE_URL || ''}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || `Failed to delete user (status ${response.status}).`);
      }

      // Re-pull the authoritative list from the server rather than just
      // splicing local state, so counts/stats elsewhere on the dashboard
      // (which also read from this same context) stay in sync too.
      await refreshUsers();
    } catch (err) {
      console.error('Delete user error:', err);
      setDeleteError(err.message || 'Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="usermanagement-container">
      <div className="usermanagement-contents">
        <div className="serach-wrapper">
          <input
            type="text"
            placeholder="search by name, username, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-icon-wrapper">
            <CiSearch className="search-icon" />
          </div>
          <div className="back-wrapper">
            <Link to="/">
              Back <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* ── ERROR BANNER ── */}
        {/* Mirrors the pattern used on the Dashboard: shown right above the
            data it concerns, with a retry path, rather than a generic alert
            disconnected from the table it's describing. */}
        {error && (
          <div className="dashboard-error-banner">
            <span>⚠️ {error}</span>
            <button type="button" className="dashboard-error-retry" onClick={refreshUsers}>
              Retry
            </button>
          </div>
        )}

        {deleteError && (
          <div className="dashboard-error-banner">
            <span>⚠️ {deleteError}</span>
          </div>
        )}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>S/n</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Verified</th>
                <th>Premium</th>
                <th>Joined</th>
                <th className="action-th" colSpan={1}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                    Loading users…
                  </td>
                </tr>
              )}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                    {searchTerm
                      ? `No users match "${searchTerm}".`
                      : 'No users found.'}
                  </td>
                </tr>
              )}

              {!loading &&
                filteredUsers.map((u, index) => {
                  const label = u.fullName || u.username || u.email || 'this user';
                  const isDeleting = deletingId === u._id;

                  return (
                    <tr key={u._id || index}>
                      <td>{index + 1}</td>
                      <td>{u.fullName || '—'}</td>
                      <td>{u.username || '—'}</td>
                      <td>{u.email || '—'}</td>
                      <td>{u.isVerified ? 'Yes' : 'No'}</td>
                      <td>{u.premium?.isPremium ? 'Yes' : 'No'}</td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td className="del">
                        <button
                          type="button"
                          onClick={() => handleDelete(u._id, label)}
                          disabled={isDeleting}
                          className='del'
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                            opacity: isDeleting ? 0.5 : 1,
                          }}
                          title={`Delete ${label}`}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
