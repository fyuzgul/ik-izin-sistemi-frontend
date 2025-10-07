import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { departmentApi, employeeApi } from '../services/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    managerId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deps, emps] = await Promise.all([
          departmentApi.getAll(),
          employeeApi.getAll()
        ]);
        setDepartments(deps);
        setEmployees(emps);
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await departmentApi.create(newDepartment);
      setShowCreateModal(false);
      setNewDepartment({
        name: '',
        description: '',
        managerId: ''
      });
      // Refresh data
      const deps = await departmentApi.getAll();
      setDepartments(deps);
    } catch (error) {
      console.error('Departman oluşturulurken hata:', error);
      alert('Departman oluşturulurken hata oluştu!');
    }
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();
    try {
      await departmentApi.update(selectedDepartment.id, newDepartment);
      setShowEditModal(false);
      setSelectedDepartment(null);
      setNewDepartment({
        name: '',
        description: '',
        managerId: ''
      });
      // Refresh data
      const deps = await departmentApi.getAll();
      setDepartments(deps);
    } catch (error) {
      console.error('Departman güncellenirken hata:', error);
      alert('Departman güncellenirken hata oluştu!');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Bu departmanı silmek istediğinizden emin misiniz?')) {
      try {
        await departmentApi.delete(id);
        // Refresh data
        const deps = await departmentApi.getAll();
        setDepartments(deps);
      } catch (error) {
        console.error('Departman silinirken hata:', error);
        alert('Departman silinirken hata oluştu!');
      }
    }
  };

  const handleActivateDepartment = async (id) => {
    try {
      await departmentApi.activate(id);
      // Refresh data
      const deps = await departmentApi.getAll();
      setDepartments(deps);
    } catch (error) {
      console.error('Departman aktifleştirilirken hata:', error);
      alert('Departman aktifleştirilirken hata oluştu!');
    }
  };

  const handleDeactivateDepartment = async (id) => {
    try {
      await departmentApi.deactivate(id);
      // Refresh data
      const deps = await departmentApi.getAll();
      setDepartments(deps);
    } catch (error) {
      console.error('Departman deaktive edilirken hata:', error);
      alert('Departman deaktive edilirken hata oluştu!');
    }
  };

  const openEditModal = (department) => {
    setSelectedDepartment(department);
    setNewDepartment({
      name: department.name,
      description: department.description || '',
      managerId: department.managerId || ''
    });
    setShowEditModal(true);
  };

  const getManagerName = (managerId) => {
    const manager = employees.find(emp => emp.id === managerId);
    return manager ? manager.fullName : 'Atanmamış';
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
            <h1 className="text-3xl font-bold text-gray-900">Departmanlar</h1>
            <p className="mt-2 text-gray-600">Departmanları yönetin</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Yeni Departman
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yönetici
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
                {departments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {department.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {department.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getManagerName(department.managerId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        department.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {department.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => openEditModal(department)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Düzenle
                      </button>
                      {department.isActive ? (
                        <button 
                          onClick={() => handleDeactivateDepartment(department.id)}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Deaktive Et
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActivateDepartment(department.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Aktifleştir
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Department Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Departman</h3>
                <form onSubmit={handleCreateDepartment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad</label>
                    <input
                      type="text"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                    <textarea
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yönetici</label>
                    <select
                      value={newDepartment.managerId}
                      onChange={(e) => setNewDepartment({...newDepartment, managerId: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Yönetici Seçin</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      Oluştur
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Department Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Departman Düzenle</h3>
                <form onSubmit={handleEditDepartment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad</label>
                    <input
                      type="text"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                    <textarea
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yönetici</label>
                    <select
                      value={newDepartment.managerId}
                      onChange={(e) => setNewDepartment({...newDepartment, managerId: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Yönetici Seçin</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      Güncelle
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

export default Departments;
