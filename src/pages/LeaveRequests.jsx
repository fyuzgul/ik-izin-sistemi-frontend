import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { leaveRequestApi } from '../services/api';
import { LeaveRequestStatus, LeaveRequestStatusLabels, LeaveRequestStatusColors } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const LeaveRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let requests;
        
        if (user?.roleName === 'Admin' || user?.roleName === 'İK Müdürü') {
          // Admin and HR see all requests
          requests = await leaveRequestApi.getAll();
        } else if (user?.roleName === 'Yönetici') {
          // Managers see only their subordinates' requests + their own
          const allRequests = await leaveRequestApi.getAll();
          requests = allRequests.filter(req => 
            req.departmentManagerId === user.employeeId || req.employeeId === user.employeeId
          );
        } else {
          // Regular employees see only their own requests
          requests = await leaveRequestApi.getMyRequests();
        }

        setLeaveRequests(requests);
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
        alert('İzin talepleri yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getStatusBadge = (status) => {
    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[LeaveRequestStatusColors[status]]}`}>
        {LeaveRequestStatusLabels[status]}
      </span>
    );
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

  const handleCancel = async (requestId) => {
    if (!window.confirm('İzin talebini iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await leaveRequestApi.cancel(requestId);
      alert('İzin talebi başarıyla iptal edildi!');
      
      // Refresh data
      let requests;
      if (user?.roleName === 'Admin' || user?.roleName === 'İK Müdürü') {
        requests = await leaveRequestApi.getAll();
      } else if (user?.roleName === 'Yönetici') {
        const allRequests = await leaveRequestApi.getAll();
        requests = allRequests.filter(req => 
          req.departmentManagerId === user.employeeId || req.employeeId === user.employeeId
        );
      } else {
        requests = await leaveRequestApi.getMyRequests();
      }
      setLeaveRequests(requests);
    } catch (error) {
      console.error('İzin talebi iptal edilirken hata:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'İzin talebi iptal edilirken hata oluştu!';
      alert(errorMessage);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">İzin Talepleri</h1>
            <p className="text-xs text-gray-500 mt-1">
              {user?.roleName === 'Admin' || user?.roleName === 'İK Müdürü' 
                ? 'Tüm izin talepleri gösteriliyor' 
                : user?.roleName === 'Yönetici'
                ? 'Sadece ekibinizdeki çalışanların talepleri gösteriliyor'
                : 'Sadece kendi izin talepleriniz gösteriliyor'}
            </p>
          </div>
          <button
            onClick={() => navigate('/leave-requests/create')}
            className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Yeni İzin Talebi
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Çalışan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İzin Türü
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlangıç
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bitiş
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gün Sayısı
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
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.employeeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.leaveTypeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(request.startDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(request.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.totalDays} gün
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(request.status === LeaveRequestStatus.Pending || 
                        request.status === LeaveRequestStatus.ApprovedByDepartmentManager) && 
                       request.employeeId === user?.employeeId && (
                        <button 
                          onClick={() => handleCancel(request.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          İptal Et
                        </button>
                      )}
                      {request.reason && (
                        <button 
                          onClick={() => alert(`Sebep: ${request.reason}`)}
                          className="text-blue-600 hover:text-blue-900 ml-3"
                        >
                          Detay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Request Modal */}
      </div>
    </Layout>
  );
};

export default LeaveRequests;
