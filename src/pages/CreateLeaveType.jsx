import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { leaveTypeApi } from '../services/api';

const CreateLeaveType = () => {
  const navigate = useNavigate();
  const [newLeaveType, setNewLeaveType] = useState({
    name: '',
    description: '',
    maxDaysPerYear: 0,
    requiresApproval: true,
    isPaid: true
  });

  const handleCreateLeaveType = async (e) => {
    e.preventDefault();
    try {
      await leaveTypeApi.create(newLeaveType);
      navigate('/leave-types');
    } catch (error) {
      console.error('İzin türü oluşturulurken hata:', error);
      alert('İzin türü oluşturulurken hata oluştu!');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Yeni İzin Türü</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Geri Dön
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleCreateLeaveType} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İzin Türü Adı</label>
              <input
                type="text"
                value={newLeaveType.name}
                onChange={(e) => setNewLeaveType({...newLeaveType, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                value={newLeaveType.description}
                onChange={(e) => setNewLeaveType({...newLeaveType, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yıllık Maksimum Gün</label>
              <input
                type="number"
                min="0"
                value={newLeaveType.maxDaysPerYear}
                onChange={(e) => setNewLeaveType({...newLeaveType, maxDaysPerYear: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requiresApproval"
                  checked={newLeaveType.requiresApproval}
                  onChange={(e) => setNewLeaveType({...newLeaveType, requiresApproval: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requiresApproval" className="ml-2 block text-sm text-gray-700">
                  Onay Gerektirir
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
                <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
                  Ücretli İzin
                </label>
              </div>
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
                İzin Türü Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateLeaveType;

