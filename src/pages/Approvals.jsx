import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { leaveRequestApi } from '../services/api';
import { LeaveRequestStatus, LeaveRequestStatusLabels } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const Approvals = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalData, setApprovalData] = useState({
    status: '',
    comments: ''
  });

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const requests = [];
        
        // Admin tüm talepleri görür
        if (user?.roleName === 'Admin') {
          const allRequests = await leaveRequestApi.getAll();
          // Sadece Pending ve ApprovedByDepartmentManager durumundaki talepleri göster
          const filteredRequests = allRequests.filter(req => 
            req.status === LeaveRequestStatus.Pending || 
            req.status === LeaveRequestStatus.ApprovedByDepartmentManager
          );
          requests.push(...filteredRequests);
        }
        // Get pending requests based on user role
        else if (user?.roleName === 'Yönetici') {
          const deptManagerRequests = await leaveRequestApi.getPendingForDepartmentManager();
          requests.push(...deptManagerRequests);
        }
        else if (user?.roleName === 'İK Müdürü') {
          const hrManagerRequests = await leaveRequestApi.getPendingForHrManager();
          requests.push(...hrManagerRequests);
        }
        
        // Remove duplicates based on request id
        const uniqueRequests = Array.from(new Map(requests.map(req => [req.id, req])).values());
        setPendingRequests(uniqueRequests);
      } catch (error) {
        console.error('Bekleyen talepler yüklenirken hata:', error);
        alert('Bekleyen talepler yüklenirken hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPendingRequests();
    }
  }, [user]);

  const handleApproval = async (e) => {
    e.preventDefault();
    try {
      await leaveRequestApi.approve(selectedRequest.id, approvalData);
      alert('İzin talebi başarıyla güncellendi!');
      setShowApprovalModal(false);
      setSelectedRequest(null);
      setApprovalData({ status: '', comments: '' });
      
      // Refresh data
      const requests = [];
      
      if (user?.roleName === 'Admin') {
        const allRequests = await leaveRequestApi.getAll();
        const filteredRequests = allRequests.filter(req => 
          req.status === LeaveRequestStatus.Pending || 
          req.status === LeaveRequestStatus.ApprovedByDepartmentManager
        );
        requests.push(...filteredRequests);
      }
      else if (user?.roleName === 'Yönetici') {
        const deptManagerRequests = await leaveRequestApi.getPendingForDepartmentManager();
        requests.push(...deptManagerRequests);
      }
      else if (user?.roleName === 'İK Müdürü') {
        const hrManagerRequests = await leaveRequestApi.getPendingForHrManager();
        requests.push(...hrManagerRequests);
      }
      
      // Remove duplicates based on request id
      const uniqueRequests = Array.from(new Map(requests.map(req => [req.id, req])).values());
      setPendingRequests(uniqueRequests);
    } catch (error) {
      console.error('Onay işlemi sırasında hata:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Onay işlemi sırasında hata oluştu!';
      alert(errorMessage);
    }
  };

  const openApprovalModal = (request, status) => {
    setSelectedRequest(request);
    setApprovalData({ status, comments: '' });
    setShowApprovalModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
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
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Bekleyen Onaylar</h1>
            <p className="text-xs text-gray-500 mt-1">
              {user?.roleName} - {user?.employeeName} {user?.roleName === 'Admin' && '(Tüm departmanların onaylarını görüyorsunuz)'}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-900 to-black px-4 py-2 rounded-xl border border-gray-700">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white font-semibold">{pendingRequests.length} Bekleyen</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(user?.roleName === 'Yönetici' || user?.roleName === 'Admin') && (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Departman Yöneticisi Onayları
                  </h2>
                  {user?.roleName === 'Admin' && <span className="text-xs text-cyan-400">Tüm Departmanlar</span>}
                </div>
              </div>
            <div className="space-y-4">
              {pendingRequests
                .filter(req => req.status === LeaveRequestStatus.Pending)
                .map((request) => (
                  <div key={request.id} className="bg-gray-800/50 border border-gray-700 hover:border-blue-500/40 rounded-xl p-5 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{request.employeeName?.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{request.employeeName}</h3>
                            <p className="text-sm text-gray-400">{request.leaveTypeName}</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                        {formatDate(request.createdDate)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4 bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center text-sm text-gray-300">
                        <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <svg className="w-4 h-4 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-white">{request.totalDays} gün</span>
                      </div>
                      {request.departmentName && (
                        <div className="flex items-center text-sm text-gray-300">
                          <svg className="w-4 h-4 text-cyan-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Departman: {request.departmentName}</span>
                        </div>
                      )}
                      {request.departmentManagerName && (
                        <div className="flex items-center text-sm text-gray-300">
                          <svg className="w-4 h-4 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Yönetici: {request.departmentManagerName}</span>
                        </div>
                      )}
                      {request.reason && (
                        <div className="text-sm text-gray-400 pt-2 border-t border-gray-700/50">
                          <span className="text-gray-500">Sebep:</span> {request.reason}
                        </div>
                      )}
                    </div>

                    {user?.roleName !== 'Admin' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openApprovalModal(request, LeaveRequestStatus.ApprovedByDepartmentManager)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Onayla
                        </button>
                        <button
                          onClick={() => openApprovalModal(request, LeaveRequestStatus.RejectedByDepartmentManager)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reddet
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              
              {pendingRequests.filter(req => req.status === LeaveRequestStatus.Pending).length === 0 && (
                <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400">Bekleyen departman yöneticisi onayı bulunmuyor</p>
                </div>
              )}
            </div>
            </div>
          )}

          {(user?.roleName === 'İK Müdürü' || user?.roleName === 'Admin') && (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    İK Müdürü Onayları
                  </h2>
                  {user?.roleName === 'Admin' && <span className="text-xs text-emerald-400">Departman Yön. Onaylı</span>}
                </div>
              </div>
            <div className="space-y-4">
              {pendingRequests
                .filter(req => req.status === LeaveRequestStatus.ApprovedByDepartmentManager)
                .map((request) => (
                  <div key={request.id} className="bg-gradient-to-br from-emerald-900/20 to-green-900/10 border border-green-500/30 hover:border-green-400/40 rounded-xl p-5 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{request.employeeName?.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{request.employeeName}</h3>
                            <p className="text-sm text-gray-400">{request.leaveTypeName}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-lg inline-block border border-green-500/30 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Departman Yön. Onayladı
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                        {formatDate(request.createdDate)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4 bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center text-sm text-gray-300">
                        <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <svg className="w-4 h-4 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-white">{request.totalDays} gün</span>
                      </div>
                      {request.departmentName && (
                        <div className="flex items-center text-sm text-gray-300">
                          <svg className="w-4 h-4 text-cyan-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Departman: {request.departmentName}</span>
                        </div>
                      )}
                      {request.departmentManagerName && (
                        <div className="flex items-center text-sm text-gray-300">
                          <svg className="w-4 h-4 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Yönetici: {request.departmentManagerName}</span>
                        </div>
                      )}
                      {request.reason && (
                        <div className="text-sm text-gray-400 pt-2 border-t border-gray-700/50">
                          <span className="text-gray-500">Sebep:</span> {request.reason}
                        </div>
                      )}
                    </div>

                    {user?.roleName !== 'Admin' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openApprovalModal(request, LeaveRequestStatus.ApprovedByHrManager)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Onayla
                        </button>
                        <button
                          onClick={() => openApprovalModal(request, LeaveRequestStatus.RejectedByHrManager)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reddet
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              
              {pendingRequests.filter(req => req.status === LeaveRequestStatus.ApprovedByDepartmentManager).length === 0 && (
                <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-gray-400">Bekleyen İK müdürü onayı bulunmuyor</p>
                </div>
              )}
            </div>
            </div>
          )}
        </div>

        {!user?.roleName || (user?.roleName !== 'Yönetici' && user?.roleName !== 'İK Müdürü' && user?.roleName !== 'Admin') && (
          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border border-yellow-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Yetki Gerekli</h3>
            <p className="text-gray-300">
              Bu sayfayı görüntüleme yetkiniz bulunmamaktadır. Sadece Yöneticiler ve İK Müdürleri onay işlemi yapabilir.
            </p>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-6 w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700">
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                  approvalData.status === LeaveRequestStatus.ApprovedByDepartmentManager || 
                  approvalData.status === LeaveRequestStatus.ApprovedByHrManager
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-red-500 to-rose-500'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {approvalData.status === LeaveRequestStatus.ApprovedByDepartmentManager || 
                     approvalData.status === LeaveRequestStatus.ApprovedByHrManager ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {approvalData.status === LeaveRequestStatus.ApprovedByDepartmentManager || 
                     approvalData.status === LeaveRequestStatus.ApprovedByHrManager
                      ? 'İzin Talebini Onayla'
                      : 'İzin Talebini Reddet'}
                  </h3>
                </div>
              </div>
              
              <form onSubmit={handleApproval} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Yorum</label>
                  <textarea
                    value={approvalData.comments}
                    onChange={(e) => setApprovalData({...approvalData, comments: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="4"
                    placeholder="İsteğe bağlı yorum ekleyin..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 px-4 py-3 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-3 text-sm font-semibold text-white rounded-lg transition-all ${
                      approvalData.status === LeaveRequestStatus.ApprovedByDepartmentManager || 
                      approvalData.status === LeaveRequestStatus.ApprovedByHrManager
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600'
                    }`}
                  >
                    {approvalData.status === LeaveRequestStatus.ApprovedByDepartmentManager || 
                     approvalData.status === LeaveRequestStatus.ApprovedByHrManager
                      ? 'Onayla'
                      : 'Reddet'}
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

export default Approvals;
