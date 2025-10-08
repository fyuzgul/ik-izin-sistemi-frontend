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
    const statusConfig = {
      yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', icon: '⏳' },
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', icon: '✓' },
      green: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', icon: '✓✓' },
      red: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', icon: '✗' },
      gray: { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500/30', icon: '◎' }
    };

    const color = LeaveRequestStatusColors[status];
    const config = statusConfig[color];

    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg border ${config.bg} ${config.text} ${config.border}`}>
        <span className="mr-1">{config.icon}</span>
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
        <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-900 to-black px-4 py-2 rounded-xl border border-gray-700">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-white font-semibold">{leaveRequests.length} Talep</span>
            </div>
            {user?.roleName !== 'Admin' && (
              <button
                onClick={() => navigate('/leave-requests/create')}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-xl transition-all duration-200 font-semibold flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yeni İzin Talebi
              </button>
            )}
          </div>
        </div>

        {leaveRequests.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-12 text-center border border-gray-700">
            <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
              <h3 className="text-xl font-bold text-white mb-2">Henüz İzin Talebi Yok</h3>
              <p className="text-gray-400">Yeni bir izin talebi oluşturarak başlayabilirsiniz</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {leaveRequests.map((request) => (
              <div key={request.id} className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{request.employeeName?.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{request.employeeName}</h3>
                      <p className="text-xs text-gray-400">{request.leaveTypeName}</p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="space-y-3 mb-4 flex-1">
                  <div className="flex items-center text-sm bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <svg className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1">
                      <span className="text-gray-300">{formatDate(request.startDate)}</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span className="text-gray-300">{formatDate(request.endDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <svg className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300"><span className="font-bold text-white">{request.totalDays}</span> gün</span>
                  </div>

                  {request.reason && (
                    <div className="text-sm bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Sebep:</p>
                      <p className="text-gray-300">{request.reason}</p>
                    </div>
                  )}
                </div>

                {(request.status === LeaveRequestStatus.Pending || 
                  request.status === LeaveRequestStatus.ApprovedByDepartmentManager) && 
                 request.employeeId === user?.employeeId && (
                  <button 
                    onClick={() => handleCancel(request.id)}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    İptal Et
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaveRequests;
