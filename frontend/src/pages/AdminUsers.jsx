import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Key,
  Shield,
  Ban,
  CheckCircle,
  X,
  AlertCircle,
  Building,
} from 'lucide-react';

export default function AdminUsers() {
  const { lang, t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPwdOpen, setIsResetPwdOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Software',
  });
  const [editData, setEditData] = useState({
    name: '',
    department: '',
    role: 'student',
    status: 'active',
  });
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');

  const departments = [
    'Management & IT Directorate',
    'Computer Science & Software',
    'Computer Science - Year 3',
    'Information Technology - Year 2',
    'Graphic Design - Year 1',
    'Faculty & Staff Team',
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'all') params.role = roleFilter;
      if (departmentFilter !== 'all') params.department = departmentFilter;

      const res = await api.getUsers(params);
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, departmentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setFormError('');
      await api.createUser(formData);
      setIsAddOpen(false);
      setFormData({
        userId: '',
        name: '',
        password: '',
        role: 'student',
        department: 'Computer Science & Software',
      });
      fetchUsers();
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Edit user
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      setFormError('');
      await api.updateUser(selectedUser.id, editData);
      setIsEditOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    try {
      setFormError('');
      await api.updateUser(selectedUser.id, { password: newPassword.trim() });
      setIsResetPwdOpen(false);
      setNewPassword('');
      alert(lang === 'km' ? 'បានផ្លាស់ប្តូរពាក្យសម្ងាត់ជោគជ័យ' : 'Password reset successfully');
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (id, name) => {
    if (
      window.confirm(
        lang === 'km'
          ? `តើអ្នកប្រាកដជាចង់លុបគណនី "${name}" ឬទេ?`
          : `Are you sure you want to delete user "${name}"?`
      )
    ) {
      try {
        await api.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'km' ? 'គ្រប់គ្រងអ្នកប្រើប្រាស់' : 'User Management'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'km'
              ? 'បង្កើតគណនីថ្មី កែប្រែព័ត៌មាន ប្តូរតួនាទី និង Reset ពាក្យសម្ងាត់'
              : 'Add, edit, change roles, reset passwords, and manage permissions'}
          </p>
        </div>

        <button
          onClick={() => {
            setFormError('');
            setIsAddOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('addNewUser')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </form>

        {/* Dropdown Filters */}
        <div className="w-full md:w-auto grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="all">{lang === 'km' ? 'គ្រប់តួនាទី' : 'All Roles'}</option>
            <option value="admin">👑 Admin</option>
            <option value="staff">👨‍🏫 Staff</option>
            <option value="student">🎓 Student</option>
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="all">{lang === 'km' ? 'គ្រប់ដេប៉ាតឺម៉ង់' : 'All Departments'}</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile User Cards View (sm:hidden) */}
      <div className="sm:hidden space-y-3">
        {users.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            {lang === 'km' ? 'រកមិនឃើញអ្នកប្រើប្រាស់ទេ' : 'No users found'}
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{u.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{u.userId}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                    u.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : u.role === 'staff'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {u.role}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="truncate max-w-[180px]">{u.department}</span>
                {u.status === 'blocked' ? (
                  <span className="text-rose-400 text-[10px] font-bold">Blocked</span>
                ) : (
                  <span className="text-emerald-400 text-[10px] font-bold">Active</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setEditData({
                      name: u.name,
                      department: u.department,
                      role: u.role,
                      status: u.status || 'active',
                    });
                    setFormError('');
                    setIsEditOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>កែប្រែ</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setNewPassword('');
                    setFormError('');
                    setIsResetPwdOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-amber-400 text-xs font-semibold flex items-center gap-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                {u.userId !== 'ADM-001' && !u.userId?.includes('admin@') && (
                  <button
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Users Table (hidden sm:block) */}
      <div className="hidden sm:block bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">អត្តលេខ (User ID)</th>
                <th className="py-3 px-4">ឈ្មោះ (Full Name)</th>
                <th className="py-3 px-4">តួនាទី (Role)</th>
                <th className="py-3 px-4">ដេប៉ាតឺម៉ង់ / ថ្នាក់</th>
                <th className="py-3 px-4">ស្ថានភាព</th>
                <th className="py-3 px-4 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white">{u.userId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{u.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        u.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : u.role === 'staff'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{u.department}</td>
                  <td className="py-3 px-4">
                    {u.status === 'blocked' ? (
                      <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setEditData({
                          name: u.name,
                          department: u.department,
                          role: u.role,
                          status: u.status || 'active',
                        });
                        setFormError('');
                        setIsEditOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Edit User"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setNewPassword('');
                        setFormError('');
                        setIsResetPwdOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800"
                      title="Reset Password"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>

                    {u.userId !== 'ADM-001' && !u.userId?.includes('admin@') && (
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{t('addNewUser')}</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ឈ្មោះពេញ (Full Name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sokha Meng"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">អត្តលេខ ឬ Email (User ID)</label>
                <input
                  type="text"
                  required
                  placeholder="STU-105 ឬ name@domain.com"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">តួនាទី (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ពាក្យសម្ងាត់</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ដេប៉ាតឺម៉ង់ / ថ្នាក់</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">កែប្រែព័ត៌មាន ({selectedUser.userId})</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ឈ្មោះ (Full Name)</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">តួនាទី (Role)</label>
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ស្ថានភាព (Status)</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="active">Active (សកម្ម)</option>
                    <option value="blocked">Blocked (ផ្អាក)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ដេប៉ាតឺម៉ង់ / ថ្នាក់</label>
                <select
                  value={editData.department}
                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPwdOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Reset Password ({selectedUser.userId})</h3>
              <button onClick={() => setIsResetPwdOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ពាក្យសម្ងាត់ថ្មី (New Password)</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsResetPwdOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
