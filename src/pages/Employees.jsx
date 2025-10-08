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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Çalışanlar</h1>
          </div>
          <button
            onClick={() => navigate('/employees/create')}
            className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Yeni Çalışan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ad Soyad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Çalışan No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşe Giriş
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Son Giriş
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.employeeNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.username || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.roleName ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {UserRoleLabels[employee.roleName] || employee.roleName}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.departmentName || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.phoneNumber || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('tr-TR') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.lastLoginDate ? new Date(employee.lastLoginDate).toLocaleDateString('tr-TR') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        employee.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleShowBalances(employee)}
                        className="text-green-600 hover:text-green-900"
                      >
                        İzin Hakları
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        Düzenle
                      </button>
                      <button 
                        onClick={() => handleDeactivateEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {employee.isActive ? 'Deaktive Et' : 'Aktive Et'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* İzin Hakları Modal */}
        {showBalanceModal && selectedEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedEmployee.firstName} {selectedEmployee.lastName} - İzin Hakları
                  </h3>
                  <button
                    onClick={() => setShowBalanceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <button
                    onClick={handleAddBalance}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    + Yeni İzin Hakkı Ekle
                  </button>
                </div>

                {leaveBalances.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Bu çalışan için henüz izin hakkı tanımlanmamış.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leaveBalances.map((balance) => (
                      <div key={balance.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-900">{balance.leaveTypeName}</h4>
                          <span className="text-xs text-gray-500">({balance.year})</span>
                        </div>
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Toplam:</span>
                            <span className="font-bold">{balance.totalDays} gün</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kullanılan:</span>
                            <span className="text-red-600">{balance.usedDays} gün</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-medium">Kalan:</span>
                            <span className="text-green-600 font-bold">{balance.remainingDays} gün</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteBalance(balance.id)}
                          className="w-full px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Yeni İzin Hakkı Ekleme Modal */}
        {showAddBalanceModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni İzin Hakkı Ekle</h3>
                
                <form onSubmit={handleSaveBalance} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">İzin Türü</label>
                    <select
                      value={balanceFormData.leaveTypeId}
                      onChange={(e) => setBalanceFormData({...balanceFormData, leaveTypeId: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">İzin Türü Seçin</option>
                      {leaveTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yıl</label>
                    <input
                      type="number"
                      value={balanceFormData.year}
                      onChange={(e) => setBalanceFormData({...balanceFormData, year: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="2020"
                      max="2100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Toplam Gün</label>
                    <input
                      type="number"
                      value={balanceFormData.totalDays}
                      onChange={(e) => setBalanceFormData({...balanceFormData, totalDays: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                      max="365"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddBalanceModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;