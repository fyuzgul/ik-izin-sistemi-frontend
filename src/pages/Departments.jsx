import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { departmentApi, authApi } from '../services/api';

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deps, emps] = await Promise.all([
          departmentApi.getAll(),
          authApi.getAllEmployees()
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

  const handleDeactivateDepartment = async (id) => {
    if (window.confirm('Bu departmanı deaktive etmek istediğinizden emin misiniz?')) {
      try {
        await departmentApi.deactivate(id);
        // Refresh data
        const deps = await departmentApi.getAll();
        setDepartments(deps);
      } catch (error) {
        console.error('Departman deaktive edilirken hata:', error);
        alert('Departman deaktive edilirken hata oluştu!');
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
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Departmanlar</h1>
          </div>
          <button
            onClick={() => navigate('/departments/create')}
            className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
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
                    Departman Adı
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
                    Oluşturulma Tarihi
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
                        {department.managerName || '-'}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(department.createdDate).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Düzenle
                      </button>
                      {department.isActive ? (
                        <button 
                          onClick={() => handleDeactivateDepartment(department.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deaktive Et
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActivateDepartment(department.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Aktive Et
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Departments;