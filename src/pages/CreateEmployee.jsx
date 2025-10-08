import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { authApi, departmentApi } from '../services/api';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeNumber: '',
    phoneNumber: '',
    hireDate: new Date().toISOString().split('T')[0],
    departmentId: '',
    username: '',
    password: '',
    roleId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deps, emps, rolesData] = await Promise.all([
          departmentApi.getAll(),
          authApi.getAllEmployees(),
          authApi.getRoles()
        ]);
        setDepartments(deps);
        setEmployees(emps);
        setRoles(rolesData);
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));

    // Eğer departman değiştirildiyse, rol alanını otomatik güncelle
    if (name === 'departmentId' && value) {
      const selectedDepartment = departments.find(d => d.id === parseInt(value));
      if (selectedDepartment) {
        // Departman yöneticisi rolünü bul
        const departmentManagerRole = roles.find(r => r.name === `${selectedDepartment.name}Manager`);
        if (departmentManagerRole) {
          setNewEmployee(prev => ({
            ...prev,
            roleId: departmentManagerRole.id
          }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await authApi.createEmployee(newEmployee);
      alert('Çalışan başarıyla oluşturuldu!');
      navigate('/employees');
    } catch (error) {
      console.error('Çalışan oluşturulurken hata:', error);
      alert('Çalışan oluşturulurken hata oluştu!');
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
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Yeni Çalışan</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Geri Dön
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={newEmployee.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soyad *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={newEmployee.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çalışan Numarası *
                </label>
                <input
                  type="text"
                  name="employeeNumber"
                  value={newEmployee.employeeNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={newEmployee.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İşe Giriş Tarihi *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={newEmployee.hireDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departman
                </label>
                <select
                  name="departmentId"
                  value={newEmployee.departmentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Departman Seçin</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  name="username"
                  value={newEmployee.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  name="password"
                  value={newEmployee.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  name="roleId"
                  value={newEmployee.roleId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Rol Seçin</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Yönetici Rolü:</strong> Bu departmanın yöneticisi olur. İzin taleplerini onaylar.<br/>
                  <strong>Çalışan Rolü:</strong> Normal çalışan. İzin talebinde bulunur.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                İptal
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEmployee;