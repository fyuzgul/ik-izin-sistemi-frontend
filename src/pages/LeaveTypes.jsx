import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { leaveTypeApi } from '../services/api';

const LeaveTypes = () => {
  const navigate = useNavigate();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await leaveTypeApi.getAll();
        setLeaveTypes(types);
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleDeleteLeaveType = async (id) => {
    if (window.confirm('Bu izin türünü silmek istediğinizden emin misiniz?')) {
      try {
        await leaveTypeApi.delete(id);
        // Refresh data
        const types = await leaveTypeApi.getAll();
        setLeaveTypes(types);
      } catch (error) {
        console.error('İzin türü silinirken hata:', error);
        alert('İzin türü silinirken hata oluştu!');
      }
    }
  };

  const handleActivateLeaveType = async (id) => {
    try {
      await leaveTypeApi.activate(id);
      // Refresh data
      const types = await leaveTypeApi.getAll();
      setLeaveTypes(types);
    } catch (error) {
      console.error('İzin türü aktifleştirilirken hata:', error);
      alert('İzin türü aktifleştirilirken hata oluştu!');
    }
  };

  const handleDeactivateLeaveType = async (id) => {
    try {
      await leaveTypeApi.deactivate(id);
      // Refresh data
      const types = await leaveTypeApi.getAll();
      setLeaveTypes(types);
    } catch (error) {
      console.error('İzin türü deaktive edilirken hata:', error);
      alert('İzin türü deaktive edilirken hata oluştu!');
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
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">İzin Türleri</h1>
          </div>
                  <button
                    onClick={() => navigate('/leave-types/create')}
                    className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Yeni İzin Türü
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
                    Yıllık Maksimum Gün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Onay Gerekli
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ücretli
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
                {leaveTypes.map((leaveType) => (
                  <tr key={leaveType.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {leaveType.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {leaveType.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {leaveType.maxDaysPerYear} gün
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        leaveType.requiresApproval 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {leaveType.requiresApproval ? 'Evet' : 'Hayır'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        leaveType.isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {leaveType.isPaid ? 'Evet' : 'Hayır'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        leaveType.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {leaveType.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {leaveType.isActive ? (
                        <button 
                          onClick={() => handleDeactivateLeaveType(leaveType.id)}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Deaktive Et
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActivateLeaveType(leaveType.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Aktifleştir
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteLeaveType(leaveType.id)}
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

      </div>
    </Layout>
  );
};

export default LeaveTypes;
