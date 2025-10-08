import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import { leaveRequestApi, employeeApi } from '../services/api';
import { LeaveRequestStatus } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const leaveBalanceApi = {
  getByEmployee: (employeeId) => axios.get(`${API_BASE_URL}/leave-balances/employee/${employeeId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data)
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  const isManager = user?.roleName === 'Yönetici' || user?.roleName === 'İK Müdürü' || user?.roleName === 'Admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isManager) {
          // Yöneticiler ve İK için genel istatistikler
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
        } else {
          // Normal çalışanlar için izin bakiyeleri
          if (user?.employeeId) {
            try {
              const balances = await leaveBalanceApi.getByEmployee(user.employeeId);
              setLeaveBalances(balances);
            } catch (error) {
              console.error('İzin bakiyeleri yüklenirken hata:', error);
              setLeaveBalances([]);
            }
          }
        }
      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, isManager]);

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
          <p className="text-xs text-gray-500 mt-1">Hoş geldiniz, {user?.employeeName || user?.username}</p>
        </div>

        {isManager ? (
          // Yönetici/İK Dashboard
          <>
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/leave-requests/create')}
                    className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Yeni İzin Talebi
                  </button>
                  <button 
                    onClick={() => navigate('/approvals')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Bekleyen Onaylar
                  </button>
                  <button 
                    onClick={() => navigate('/employees/create')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Çalışan Ekle
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sistem Özeti</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Toplam {stats.totalEmployees} çalışan sistemde kayıtlı</p>
                  <p>• {stats.pendingRequests} izin talebi onay bekliyor</p>
                  <p>• {stats.approvedRequests} izin talebi onaylandı</p>
                  <p>• {stats.rejectedRequests} izin talebi reddedildi</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Çalışan Dashboard - İzin Bakiyeleri
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">İzin Haklarım</h2>
              
              {leaveBalances.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Henüz izin hakkınız tanımlanmamış. Lütfen İK departmanı ile iletişime geçin.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leaveBalances.map((balance) => (
                    <div key={balance.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{balance.leaveTypeName}</h3>
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Toplam Hak:</span>
                          <span className="text-lg font-bold text-gray-900">{balance.totalDays} gün</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Kullanılan:</span>
                          <span className="text-lg font-semibold text-red-600">{balance.usedDays} gün</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-700">Kalan:</span>
                          <span className="text-2xl font-bold text-green-600">{balance.remainingDays} gün</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Kullanım Oranı</span>
                            <span>{Math.round((balance.usedDays / balance.totalDays) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(balance.usedDays / balance.totalDays) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/leave-requests/create')}
                    className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Yeni İzin Talebi Oluştur
                  </button>
                  <button 
                    onClick={() => navigate('/leave-requests')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    İzin Taleplerim
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Bilgi</h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• İzin talebiniz önce departman yöneticiniz tarafından onaylanmalıdır</p>
                  <p>• Departman yöneticisi onayladıktan sonra İK departmanının onayına sunulur</p>
                  <p>• Her iki onay alındığında izin kullanım hakkınızdan düşülecektir</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
