import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { leaveTypeApi } from '../services/api';

const LeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [newLeaveType, setNewLeaveType] = useState({
    name: '',
    description: '',
    maxDaysPerYear: 0,
    requiresApproval: true,
    isPaid: true
  });

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

  const handleCreateLeaveType = async (e) => {
    e.preventDefault();
    try {
      await leaveTypeApi.create(newLeaveType);
      setShowCreateModal(false);
      setNewLeaveType({
        name: '',
        description: '',
        maxDaysPerYear: 0,
        requiresApproval: true,
        isPaid: true
      });
      // Refresh data
      const types = await leaveTypeApi.getAll();
      setLeaveTypes(types);
    } catch (error) {
      console.error('İzin türü oluşturulurken hata:', error);
      alert('İzin türü oluşturulurken hata oluştu!');
    }
  };

  const handleEditLeaveType = async (e) => {
    e.preventDefault();
    try {
      await leaveTypeApi.update(selectedLeaveType.id, newLeaveType);
      setShowEditModal(false);
      setSelectedLeaveType(null);
      setNewLeaveType({
        name: '',
        description: '',
        maxDaysPerYear: 0,
        requiresApproval: true,
        isPaid: true
      });
      // Refresh data
      const types = await leaveTypeApi.getAll();
      setLeaveTypes(types);
    } catch (error) {
      console.error('İzin türü güncellenirken hata:', error);
      alert('İzin türü güncellenirken hata oluştu!');
    }
  };

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

  const openEditModal = (leaveType) => {
    setSelectedLeaveType(leaveType);
    setNewLeaveType({
      name: leaveType.name,
      description: leaveType.description || '',
      maxDaysPerYear: leaveType.maxDaysPerYear,
      requiresApproval: leaveType.requiresApproval,
      isPaid: leaveType.isPaid
    });
    setShowEditModal(true);
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
            <h1 className="text-3xl font-bold text-gray-900">İzin Türleri</h1>
            <p className="mt-2 text-gray-600">İzin türlerini yönetin</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
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
                      <button 
                        onClick={() => openEditModal(leaveType)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Düzenle
                      </button>
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

        {/* Create Leave Type Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni İzin Türü</h3>
                <form onSubmit={handleCreateLeaveType} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad</label>
                    <input
                      type="text"
                      value={newLeaveType.name}
                      onChange={(e) => setNewLeaveType({...newLeaveType, name: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                    <textarea
                      value={newLeaveType.description}
                      onChange={(e) => setNewLeaveType({...newLeaveType, description: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yıllık Maksimum Gün</label>
                    <input
                      type="number"
                      min="0"
                      value={newLeaveType.maxDaysPerYear}
                      onChange={(e) => setNewLeaveType({...newLeaveType, maxDaysPerYear: parseInt(e.target.value)})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requiresApproval"
                      checked={newLeaveType.requiresApproval}
                      onChange={(e) => setNewLeaveType({...newLeaveType, requiresApproval: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requiresApproval" className="ml-2 block text-sm text-gray-900">
                      Onay Gerekli
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPaid"
                      checked={newLeaveType.isPaid}
                      onChange={(e) => setNewLeaveType({...newLeaveType, isPaid: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-900">
                      Ücretli
                    </label>
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

        {/* Edit Leave Type Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">İzin Türü Düzenle</h3>
                <form onSubmit={handleEditLeaveType} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad</label>
                    <input
                      type="text"
                      value={newLeaveType.name}
                      onChange={(e) => setNewLeaveType({...newLeaveType, name: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                    <textarea
                      value={newLeaveType.description}
                      onChange={(e) => setNewLeaveType({...newLeaveType, description: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yıllık Maksimum Gün</label>
                    <input
                      type="number"
                      min="0"
                      value={newLeaveType.maxDaysPerYear}
                      onChange={(e) => setNewLeaveType({...newLeaveType, maxDaysPerYear: parseInt(e.target.value)})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editRequiresApproval"
                      checked={newLeaveType.requiresApproval}
                      onChange={(e) => setNewLeaveType({...newLeaveType, requiresApproval: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="editRequiresApproval" className="ml-2 block text-sm text-gray-900">
                      Onay Gerekli
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editIsPaid"
                      checked={newLeaveType.isPaid}
                      onChange={(e) => setNewLeaveType({...newLeaveType, isPaid: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="editIsPaid" className="ml-2 block text-sm text-gray-900">
                      Ücretli
                    </label>
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

export default LeaveTypes;
