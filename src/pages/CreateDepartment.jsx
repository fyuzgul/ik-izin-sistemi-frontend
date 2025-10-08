import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { departmentApi } from '../services/api';

const CreateDepartment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDepartment(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await departmentApi.create(newDepartment);
      alert('Departman başarıyla oluşturuldu! Otomatik olarak departmana özel roller de oluşturuldu.');
      navigate('/departments');
    } catch (error) {
      console.error('Departman oluşturulurken hata:', error);
      alert('Departman oluşturulurken hata oluştu!');
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
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Yeni Departman</h1>
          </div>
          <button
            onClick={() => navigate('/departments')}
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
                  Departman Adı *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newDepartment.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Üretim"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Bu departman için otomatik olarak "{newDepartment.name} Departman Yöneticisi" ve "{newDepartment.name} Çalışanı" rolleri oluşturulacak.
                </p>
              </div>


              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  value={newDepartment.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Departman açıklaması..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newDepartment.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/departments')}
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

export default CreateDepartment;