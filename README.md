# İzin Sistemi Frontend

Bu proje React ve Tailwind CSS kullanarak geliştirilmiş bir izin talep sistemi frontend'idir.

## Teknolojiler

- React 18
- Tailwind CSS
- Axios (HTTP istekleri için)
- React Router (Sayfa yönlendirme için)

## Kurulum

1. Projeyi klonlayın
2. `npm install` komutu ile paketleri yükleyin
3. `npm start` komutu ile development server'ı başlatın

## Özellikler

### Dashboard
- Sistem genel durumu
- İstatistikler (toplam çalışan, bekleyen talepler, vb.)
- Hızlı işlemler

### İzin Talepleri
- Tüm izin taleplerini görüntüleme
- Yeni izin talebi oluşturma
- İzin talebi detaylarını görüntüleme
- İzin talebini iptal etme

### Onaylar
- Departman yöneticisi onayları
- İK müdürü onayları
- Onaylama/reddetme işlemleri
- Yorum ekleme

### Çalışan Yönetimi
- Çalışan listesi
- Yeni çalışan ekleme
- Çalışan bilgilerini güncelleme

### İzin Türleri
- İzin türü listesi
- Yeni izin türü ekleme
- İzin türü ayarları

## API Entegrasyonu

Frontend, backend API'si ile şu şekilde entegre edilmiştir:
- Base URL: `https://localhost:7000/api`
- Tüm HTTP istekleri Axios ile yapılır
- CORS desteği aktif

## Kullanım

1. Backend API'sinin çalıştığından emin olun
2. Frontend'i başlatın: `npm start`
3. Tarayıcıda `http://localhost:3000` adresini açın

## Responsive Tasarım

Uygulama tüm cihaz boyutlarında çalışacak şekilde tasarlanmıştır:
- Mobil cihazlar
- Tabletler
- Masaüstü bilgisayarlar

## Bileşen Yapısı

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   └── Dashboard/
│       └── StatsCard.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── LeaveRequests.jsx
│   └── Approvals.jsx
├── services/
│   └── api.js
├── constants/
│   └── index.js
└── App.js
```