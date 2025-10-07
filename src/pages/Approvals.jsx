import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { leaveRequestApi } from '../services/api';
import { LeaveRequestStatus, LeaveRequestStatusLabels } from '../constants';

const Approvals = () => {
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
        // Get pending requests for department managers and HR managers
        const [deptManagerRequests, hrManagerRequests] = await Promise.all([
          leaveRequestApi.getPendingForDepartmentManager(1), // Replace with actual manager ID
          leaveRequestApi.getPendingForHrManager()
        ]);
        
        const allPending = [...deptManagerRequests, ...hrManagerRequests];
        setPendingRequests(allPending);
      } catch (error) {
        console.error('Bekleyen talepler yüklenirken hata:', error);
        // Fallback to getting all requests and filtering
        try {
          const allRequests = await leaveRequestApi.getAll();
          const pending = allRequests.filter(
            req => req.status === LeaveRequestStatus.Pending ||
                   req.status === LeaveRequestStatus.ApprovedByDepartmentManager
          );
          setPendingRequests(pending);
        } catch (fallbackError) {
          console.error('Fallback veri yükleme hatası:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleApproval = async (e) => {
    e.preventDefault();
    try {
      await leaveRequestApi.approve(selectedRequest.id, approvalData);
      setShowApprovalModal(false);
      setSelectedRequest(null);
      setApprovalData({ status: '', comments: '' });
      
      // Refresh data
      try {
        const [deptManagerRequests, hrManagerRequests] = await Promise.all([
          leaveRequestApi.getPendingForDepartmentManager(1), // Replace with actual manager ID
          leaveRequestApi.getPendingForHrManager()
        ]);
        
        const allPending = [...deptManagerRequests, ...hrManagerRequests];
        setPendingRequests(allPending);
      } catch (error) {
        // Fallback to getting all requests and filtering
        const allRequests = await leaveRequestApi.getAll();
        const pending = allRequests.filter(
          req => req.status === LeaveRequestStatus.Pending ||
                 req.status === LeaveRequestStatus.ApprovedByDepartmentManager
        );
        setPendingRequests(pending);
      }
    } catch (error) {
      console.error('Onay işlemi sırasında hata:', error);
      alert('Onay işlemi sırasında hata oluştu!');
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Onaylar</h1>
          <p className="mt-2 text-gray-600">Bekleyen izin taleplerini onaylayın veya reddedin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Departman Yöneticisi Onayları</h2>
            <div className="space-y-4">
              {pendingRequests
                .filter(req => req.status === LeaveRequestStatus.Pending)
                .map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{request.employeeName}</h3>
                        <p className="text-sm text-gray-600">{request.leaveTypeName}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(request.createdDate)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <p><strong>Tarih:</strong> {formatDate(request.startDate)} - {formatDate(request.endDate)}</p>
                      <p><strong>Gün Sayısı:</strong> {request.totalDays} gün</p>
                      {request.reason && <p><strong>Sebep:</strong> {request.reason}</p>}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openApprovalModal(request, LeaveRequestStatus.ApprovedByDepartmentManager)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => openApprovalModal(request, LeaveRequestStatus.RejectedByDepartmentManager)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      >
                        Reddet
                      </button>
                    </div>
                  </div>
                ))}
              
              {pendingRequests.filter(req => req.status === LeaveRequestStatus.Pending).length === 0 && (
                <p className="text-gray-500 text-center py-4">Bekleyen departman yöneticisi onayı bulunmuyor.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">İK Müdürü Onayları</h2>
            <div className="space-y-4">
              {pendingRequests
                .filter(req => req.status === LeaveRequestStatus.ApprovedByDepartmentManager)
                .map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{request.employeeName}</h3>
                        <p className="text-sm text-gray-600">{request.leaveTypeName}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(request.createdDate)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <p><strong>Tarih:</strong> {formatDate(request.startDate)} - {formatDate(request.endDate)}</p>
                      <p><strong>Gün Sayısı:</strong> {request.totalDays} gün</p>
                      {request.reason && <p><strong>Sebep:</strong> {request.reason}</p>}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openApprovalModal(request, LeaveRequestStatus.ApprovedByHrManager)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => openApprovalModal(request, LeaveRequestStatus.RejectedByHrManager)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      >
                        Reddet
                      </button>
                    </div>
                  </div>
                ))}
              
              {pendingRequests.filter(req => req.status === LeaveRequestStatus.ApprovedByDepartmentManager).length === 0 && (
                <p className="text-gray-500 text-center py-4">Bekleyen İK müdürü onayı bulunmuyor.</p>
              )}
            </div>
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {approvalData.status === LeaveRequestStatus.ApprovedByDepartmentManager || 
                   approvalData.status === LeaveRequestStatus.ApprovedByHrManager
                    ? 'İzin Talebini Onayla'
                    : 'İzin Talebini Reddet'}
                </h3>
                
                <form onSubmit={handleApproval} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yorum</label>
                    <textarea
                      value={approvalData.comments}
                      onChange={(e) => setApprovalData({...approvalData, comments: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="İsteğe bağlı yorum ekleyin..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowApprovalModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                        approvalData.status === LeaveRequestStatus.ApprovedByDepartmentManager || 
                        approvalData.status === LeaveRequestStatus.ApprovedByHrManager
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Approvals;
