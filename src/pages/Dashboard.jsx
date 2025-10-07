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
        <div className="mb-4">
          <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Toplam Çalışan"
            value={stats.totalEmployees}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            isDark={true}
          />
          <StatsCard
            title="Bekleyen Talepler"
            value={stats.pendingRequests}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            isDark={false}
          />
          <StatsCard
            title="Onaylanan Talepler"
            value={stats.approvedRequests}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            isDark={true}
          />
          <StatsCard
            title="Reddedilen Talepler"
            value={stats.rejectedRequests}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            isDark={false}
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
              <button className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
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
