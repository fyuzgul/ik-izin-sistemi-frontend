import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { leaveRequestApi, leaveTypeApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CreateLeaveRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await leaveTypeApi.getAll();
        setLeaveTypes(types);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      // Backend will automatically use the logged-in user's employeeId from JWT token
      // We still send employeeId for backward compatibility, but it will be overridden
      await leaveRequestApi.create({
        ...newRequest,
        employeeId: user?.employeeId || 0
      });
      alert('İzin talebiniz başarıyla oluşturuldu!');
      navigate('/leave-requests');
    } catch (error) {
      console.error('İzin talebi oluşturulurken hata:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'İzin talebi oluşturulurken hata oluştu!';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Yükleniyor...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Yeni İzin Talebi</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Geri Dön
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Çalışan:</span> {user?.employeeName || user?.username}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Kendiniz için izin talebi oluşturuyorsunuz
            </p>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İzin Türü</label>
              <select
                value={newRequest.leaveTypeId}
                onChange={(e) => setNewRequest({...newRequest, leaveTypeId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">İzin Türü Seçin</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={newRequest.startDate}
                  onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                <input
                  type="date"
                  value={newRequest.endDate}
                  onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                value={newRequest.reason}
                onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="İzin talebi açıklaması..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                İzin Talebi Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateLeaveRequest;

