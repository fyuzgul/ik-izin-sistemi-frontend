import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { employeeApi, departmentApi, authApi, leaveTypeApi } from '../services/api';
import { UserRole, UserRoleLabels } from '../constants';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const leaveBalanceApi = {
  getByEmployee: (employeeId) => axios.get(`${API_BASE_URL}/leave-balances/employee/${employeeId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data),
  create: (data) => axios.post(`${API_BASE_URL}/leave-balances`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data),
  update: (id, data) => axios.put(`${API_BASE_URL}/leave-balances/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  delete: (id) => axios.delete(`${API_BASE_URL}/leave-balances/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
};

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [balanceFormData, setBalanceFormData] = useState({
    leaveTypeId: '',
    year: new Date().getFullYear(),
    totalDays: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emps, deps, rolesData] = await Promise.all([
          authApi.getAllEmployees(),
          departmentApi.getAll(),
          authApi.getRoles()
        ]);
        setEmployees(emps);
        setDepartments(deps);
        setRoles(rolesData);
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeactivateEmployee = async (id) => {
    if (window.confirm('Bu çalışanı deaktive etmek istediğinizden emin misiniz?')) {
      try {
        await authApi.deactivateEmployee(id);
        // Refresh data
        const emps = await authApi.getAllEmployees();
        setEmployees(emps);
      } catch (error) {
        console.error('Çalışan deaktive edilirken hata:', error);
        alert('Çalışan deaktive edilirken hata oluştu!');
      }
    }
  };

  const handleShowBalances = async (employee) => {
    setSelectedEmployee(employee);
    try {
      const [balances, types] = await Promise.all([
        leaveBalanceApi.getByEmployee(employee.id),
        leaveTypeApi.getAll()
      ]);
      setLeaveBalances(balances);
      setLeaveTypes(types);
      setShowBalanceModal(true);
    } catch (error) {
      console.error('İzin hakları yüklenirken hata:', error);
      alert('İzin hakları yüklenirken hata oluştu');
    }
  };

  const handleAddBalance = () => {
    setBalanceFormData({
      leaveTypeId: '',
      year: new Date().getFullYear(),
      totalDays: ''
    });
    setShowAddBalanceModal(true);
  };

  const handleSaveBalance = async (e) => {
    e.preventDefault();
    try {
      await leaveBalanceApi.create({
        employeeId: selectedEmployee.id,
        leaveTypeId: parseInt(balanceFormData.leaveTypeId),
        year: parseInt(balanceFormData.year),
        totalDays: parseInt(balanceFormData.totalDays)
      });
      alert('İzin hakkı başarıyla tanımlandı!');
      setShowAddBalanceModal(false);
      // Refresh balances
      const balances = await leaveBalanceApi.getByEmployee(selectedEmployee.id);
      setLeaveBalances(balances);
    } catch (error) {
      console.error('İzin hakkı tanımlama hatası:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'İzin hakkı tanımlanamadı';
      alert(errorMessage);
    }
  };

  const handleDeleteBalance = async (balanceId) => {
    if (!window.confirm('Bu izin hakkını silmek istediğinizden emin misiniz?')) {
      return;
    }
    try {
      await leaveBalanceApi.delete(balanceId);
      alert('İzin hakkı başarıyla silindi!');
      // Refresh balances
      const balances = await leaveBalanceApi.getByEmployee(selectedEmployee.id);
      setLeaveBalances(balances);
    } catch (error) {
      console.error('İzin hakkı silme hatası:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'İzin hakkı silinemedi';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Yükleniyor...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Çalışanlar</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-900 to-black px-4 py-2 rounded-xl border border-gray-700">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-white font-semibold">{employees.length} Çalışan</span>
            </div>
            <button
              onClick={() => navigate('/employees/create')}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl transition-all duration-200 font-semibold flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Yeni Çalışan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-400">{employee.employeeNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                  employee.isActive 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {employee.isActive ? '● Aktif' : '○ Pasif'}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-4 flex-1">
                {employee.email && (
                  <div className="flex items-center text-sm bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <svg className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300 break-all">{employee.email}</span>
                  </div>
                )}

                {employee.roleName && (
                  <div className="flex items-center text-sm bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <svg className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-purple-300 font-semibold">{UserRoleLabels[employee.roleName] || employee.roleName}</span>
                  </div>
                )}

                {employee.departmentName && (
                  <div className="flex items-center text-sm bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <svg className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-gray-300">{employee.departmentName}</span>
                  </div>
                )}

                {employee.phoneNumber && (
                  <div className="flex items-center text-sm bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-300">{employee.phoneNumber}</span>
                  </div>
                )}

                {employee.hireDate && (
                  <div className="flex items-center text-sm bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <svg className="w-4 h-4 text-orange-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300">İşe Giriş: {new Date(employee.hireDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-gray-700/50">
                <button 
                  onClick={() => handleShowBalances(employee)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  İzin Hakları
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm">
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleDeactivateEmployee(employee.id)}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
                      employee.isActive
                        ? 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    }`}
                  >
                    {employee.isActive ? 'Deaktive Et' : 'Aktive Et'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* İzin Hakları Modal */}
        {showBalanceModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h3>
                    <p className="text-sm text-gray-400">İzin Hakları</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBalanceModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <button
                  onClick={handleAddBalance}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Yeni İzin Hakkı Ekle
                </button>
              </div>

              {leaveBalances.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-400">Bu çalışan için henüz izin hakkı tanımlanmamış.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leaveBalances.map((balance) => (
                    <div key={balance.id} className="bg-gray-800/50 border border-gray-700 hover:border-green-600/40 rounded-xl p-5 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-white text-lg">{balance.leaveTypeName}</h4>
                        <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">{balance.year}</span>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center bg-gray-900/50 rounded-lg p-2 border border-gray-700/50">
                          <span className="text-gray-400 text-sm">Toplam:</span>
                          <span className="font-bold text-white">{balance.totalDays} gün</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-900/50 rounded-lg p-2 border border-gray-700/50">
                          <span className="text-gray-400 text-sm">Kullanılan:</span>
                          <span className="text-red-400 font-bold">{balance.usedDays} gün</span>
                        </div>
                        <div className="flex justify-between items-center bg-gradient-to-r from-green-900/30 to-emerald-900/20 rounded-lg p-3 border border-green-500/30">
                          <span className="text-green-300 font-semibold">Kalan:</span>
                          <span className="text-green-300 font-bold text-xl">{balance.remainingDays} gün</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBalance(balance.id)}
                        className="w-full bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Yeni İzin Hakkı Ekleme Modal */}
        {showAddBalanceModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Yeni İzin Hakkı Ekle</h3>
              </div>
              
              <form onSubmit={handleSaveBalance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">İzin Türü</label>
                  <select
                    value={balanceFormData.leaveTypeId}
                    onChange={(e) => setBalanceFormData({...balanceFormData, leaveTypeId: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">İzin Türü Seçin</option>
                    {leaveTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Yıl</label>
                  <input
                    type="number"
                    value={balanceFormData.year}
                    onChange={(e) => setBalanceFormData({...balanceFormData, year: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    min="2020"
                    max="2100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Toplam Gün</label>
                  <input
                    type="number"
                    value={balanceFormData.totalDays}
                    onChange={(e) => setBalanceFormData({...balanceFormData, totalDays: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    min="0"
                    max="365"
                  />
                </div>

                <div className="flex space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddBalanceModal(false)}
                    className="flex-1 px-4 py-3 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg transition-all"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;