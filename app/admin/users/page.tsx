"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  phoneNumber?: string | null;
  village?: string | null;
  union?: string | null;
  upazila?: string | null;
  district?: string | null;
  educationalQualification?: string | null;
  profession?: string | null;
  electionSeatNo?: string | null;
  favoriteParty?: string | null;
  createdAt: string;
  updatedAt?: string;
}

interface FullUser {
  id: string;
  email: string;
  fullName: string;
  fatherName: string | null;
  educationalQualification: string | null;
  profession: string | null;
  village: string | null;
  union: string | null;
  upazila: string | null;
  district: string | null;
  electionSeatNo: string | null;
  phoneNumber: string | null;
  favoriteParty: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [viewUser, setViewUser] = useState<FullUser | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (userId: string) => {
    try {
      setViewError("");
      setViewLoading(true);
      setViewUser(null);
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data: FullUser = await res.json();
      setViewUser(data);
    } catch (e) {
      setViewError("Could not load user details. Please try again.");
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    setViewUser(null);
    setViewError("");
    setViewLoading(false);
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ));
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const normalizedIncludes = (value: string | null | undefined, query: string) => {
    if (!value) return false;
    return value.toString().toLowerCase().includes(query);
  };

  const filteredUsers = users.filter(user => {
    const q = searchTerm.trim().toLowerCase();

    const matchesSearch = q === "" || (
      normalizedIncludes(user.fullName, q) ||
      normalizedIncludes(user.email, q) ||
      normalizedIncludes(user.phoneNumber, q) ||
      normalizedIncludes(user.village, q) ||
      normalizedIncludes(user.union, q) ||
      normalizedIncludes(user.upazila, q) ||
      normalizedIncludes(user.district, q) ||
      normalizedIncludes(user.educationalQualification, q) ||
      normalizedIncludes(user.profession, q) ||
      normalizedIncludes(user.electionSeatNo, q) ||
      normalizedIncludes(user.favoriteParty, q) ||
      normalizedIncludes(user.role, q) ||
      (user.isActive ? "active" : "inactive").includes(q)
    );

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && user.isActive) ||
                         (filterStatus === "inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleExportPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });

    const marginX = 40;
    let y = 40;

    doc.setFontSize(16);
    doc.text("Users Export", marginX, y);
    y += 20;
    doc.setFontSize(10);
    const exportDate = new Date().toLocaleString();
    doc.text(`Generated: ${exportDate}`, marginX, y);
    y += 20;

    // Table headers
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Village",
      "Union",
      "Role",
      "Status",
      "Created",
    ];

    const colWidths = [150, 200, 90, 100, 100, 70, 70, 110];

    doc.setFont(undefined, "bold");
    let x = marginX;
    headers.forEach((h, idx) => {
      doc.text(h, x, y);
      x += colWidths[idx];
    });

    doc.setFont(undefined, "normal");
    y += 16;

    const rows = filteredUsers.map(u => [
      u.fullName || "",
      u.email || "",
      u.phoneNumber || "",
      u.village || "",
      u.union || "",
      u.role || "",
      u.isActive ? "Active" : "Inactive",
      new Date(u.createdAt).toLocaleDateString(),
    ]);

    rows.forEach((row) => {
      x = marginX;
      row.forEach((cell, idx) => {
        const text = (cell ?? "").toString();
        const maxWidth = colWidths[idx] - 6;
        const lines = doc.splitTextToSize(text, maxWidth);
        // Print each line
        lines.forEach((line: string, lineIdx: number) => {
          doc.text(line, x, y + lineIdx * 12);
        });
      x += colWidths[idx];
      });
      // Move to next row; estimate row height by max lines (approx)
      y += 16;
      if (y > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        y = 40;
      }
    });

    doc.save(`users_${Date.now()}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            title="Export filtered users to PDF"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0l-3-3m3 3l3-3M4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
            </svg>
            Export PDF
          </button>
          <Link
            href="/admin/users/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search (all fields)
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search name, email, phone, location, role, status, etc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.district || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3 items-center">
                        <button
                          onClick={() => openViewModal(user.id)}
                          title="View details"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          className={`${
                            user.isActive 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {(viewLoading || viewUser || viewError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeViewModal}></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
              <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {viewLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              )}
              {viewError && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded px-4 py-3 text-sm">
                  {viewError}
                </div>
              )}
              {viewUser && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Basic Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Full Name</div>
                        <div className="text-gray-900 font-medium">{viewUser.fullName}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Email</div>
                        <div className="text-gray-900 font-medium">{viewUser.email}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Phone</div>
                        <div className="text-gray-900 font-medium">{viewUser.phoneNumber || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Father's Name</div>
                        <div className="text-gray-900 font-medium">{viewUser.fatherName || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Education & Profession</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Educational Qualification</div>
                        <div className="text-gray-900 font-medium">{viewUser.educationalQualification || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Profession</div>
                        <div className="text-gray-900 font-medium">{viewUser.profession || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Location</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Village</div>
                        <div className="text-gray-900 font-medium">{viewUser.village || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Union</div>
                        <div className="text-gray-900 font-medium">{viewUser.union || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Upazila</div>
                        <div className="text-gray-900 font-medium">{viewUser.upazila || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">District</div>
                        <div className="text-gray-900 font-medium">{viewUser.district || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Election & Political</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Election Seat No.</div>
                        <div className="text-gray-900 font-medium">{viewUser.electionSeatNo || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Favorite Party</div>
                        <div className="text-gray-900 font-medium">{viewUser.favoriteParty || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Account</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Role</div>
                        <div className="text-gray-900 font-medium">{viewUser.role}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Status</div>
                        <div className="text-gray-900 font-medium">{viewUser.isActive ? 'Active' : 'Inactive'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Joined</div>
                        <div className="text-gray-900 font-medium">{new Date(viewUser.createdAt).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Last Updated</div>
                        <div className="text-gray-900 font-medium">{new Date(viewUser.updatedAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button onClick={closeViewModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
