import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import { leaveRequestApi, employeeApi } from '../services/api';
import { LeaveRequestStatus } from '../constants';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [employees, leaveRequests] = await Promise.all([
          employeeApi.getAll(),
          leaveRequestApi.getAll()
        ]);

        const pendingRequests = leaveRequests.filter(
          req => req.status === LeaveRequestStatus.Pending
        ).length;

        const approvedRequests = leaveRequests.filter(
          req => req.status === LeaveRequestStatus.ApprovedByHrManager
        ).length;

        const rejectedRequests = leaveRequests.filter(
          req => req.status === LeaveRequestStatus.RejectedByDepartmentManager ||
                 req.status === LeaveRequestStatus.RejectedByHrManager
        ).length;

        setStats({
          totalEmployees: employees.length,
          pendingRequests,
          approvedRequests,
          rejectedRequests
        });
      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">İzin sistemi genel durumu</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Toplam Çalışan"
            value={stats.totalEmployees}
            icon="👥"
            color="blue"
          />
          <StatsCard
            title="Bekleyen Talepler"
            value={stats.pendingRequests}
            icon="⏳"
            color="yellow"
          />
          <StatsCard
            title="Onaylanan Talepler"
            value={stats.approvedRequests}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="Reddedilen Talepler"
            value={stats.rejectedRequests}
            icon="❌"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Son İzin Talepleri</h2>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                Son 5 izin talebi burada görüntülenecek...
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                Yeni İzin Talebi
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                Bekleyen Onaylar
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                Çalışan Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
