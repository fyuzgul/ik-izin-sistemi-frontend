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
              {/* Hızlı İşlemler - Dark Theme */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Hızlı İşlemler</h2>
                </div>
                <div className="space-y-3">
                  {user?.roleName !== 'Admin' && (
                    <button 
                      onClick={() => navigate('/leave-requests/create')}
                      className="group w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-between"
                    >
                      <span className="font-semibold">Yeni İzin Talebi</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                  <button 
                    onClick={() => navigate('/approvals')}
                    className="group w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-between"
                  >
                    <span className="font-semibold">Bekleyen Onaylar</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigate('/employees/create')}
                    className="group w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-between"
                  >
                    <span className="font-semibold">Çalışan Ekle</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigate('/departments/create')}
                    className="group w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-between"
                  >
                    <span className="font-semibold">Departman Ekle</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigate('/leave-types/create')}
                    className="group w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-between"
                  >
                    <span className="font-semibold">İzin Türü Ekle</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Sistem Özeti - Dark Theme */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Sistem Özeti</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Toplam Çalışan</p>
                      <p className="text-white text-2xl font-bold">{stats.totalEmployees}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Bekleyen Talepler</p>
                      <p className="text-white text-2xl font-bold">{stats.pendingRequests}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Onaylanan Talepler</p>
                      <p className="text-white text-2xl font-bold">{stats.approvedRequests}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Reddedilen Talepler</p>
                      <p className="text-white text-2xl font-bold">{stats.rejectedRequests}</p>
                    </div>
                  </div>
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
                    <div key={balance.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all">
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
              {/* Hızlı İşlemler - Dark Theme (Çalışan) */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Hızlı İşlemler</h2>
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => navigate('/leave-requests/create')}
                    className="group w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-between"
                  >
                    <span className="font-semibold">Yeni İzin Talebi Oluştur</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigate('/leave-requests')}
                    className="group w-full bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-between"
                  >
                    <span className="font-semibold">İzin Taleplerim</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bilgi Paneli - Dark Theme */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Bilgi</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      İzin talebiniz önce departman yöneticiniz tarafından onaylanmalıdır
                    </p>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Departman yöneticisi onayladıktan sonra İK departmanının onayına sunulur
                    </p>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Her iki onay alındığında izin kullanım hakkınızdan düşülecektir
                    </p>
                  </div>
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
