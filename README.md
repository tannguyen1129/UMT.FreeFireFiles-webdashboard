# 🌿 Green-AQI Navigator - Web Dashboard (Admin)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-Next.js%20|%20Docker-black?style=for-the-badge)

> **UMT.FreeFireFiles-webdashboard** là cổng thông tin quản trị (Admin Portal) dành cho Cán bộ quản lý và Quản trị viên hệ thống **Green-AQI Navigator**. Hệ thống cung cấp công cụ giám sát chất lượng không khí, quản lý báo cáo sự cố và người dùng.

## 📖 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt & Triển khai](#-cài-đặt--triển-khai)
    - [Chạy bằng Docker (Khuyên dùng)](#1-chạy-bằng-docker-production)
    - [Chạy môi trường Dev](#2-chạy-môi-trường-phát-triển-local)
- [Cấu hình](#-cấu-hình)
- [Đóng góp](#-đóng-góp)
- [Tác giả](#-tác-giả)

---

## 📖 Giới thiệu

Web Dashboard đóng vai trò là "Trung tâm chỉ huy", cho phép các cơ quan chức năng (Sở TNMT) và Admin:
* Giám sát các chỉ số AQI theo thời gian thực trên bản đồ.
* Tiếp nhận và xử lý các báo cáo sự cố môi trường từ người dân.
* Quản lý dữ liệu người dùng và phân quyền hệ thống.

## ✨ Tính năng chính

* **🖥️ Dashboard tổng quan:** Thống kê số lượng báo cáo, chỉ số AQI trung bình, lưu lượng truy cập.
* **🗺️ Giám sát thời gian thực:** Bản đồ trực quan hóa dữ liệu từ các trạm quan trắc (Agents).
* **⚙️ Quản lý sự cố (Incident Management):** Duyệt hoặc từ chối các báo cáo ô nhiễm từ ứng dụng công dân.
* **👥 Quản lý người dùng:** Phân quyền Admin, Cán bộ (Gov), và Người dùng (Citizen).
* **📊 Báo cáo & Thống kê:** Xuất dữ liệu lịch sử ô nhiễm.

## 🛠 Công nghệ sử dụng

* **Framework:** [Next.js](https://nextjs.org/) (Server-side Rendering)
* **Styling:** Tailwind CSS
* **Maps:** Leaflet
* **Containerization:** Docker

## 📋 Yêu cầu hệ thống

* **Docker & Docker Compose** (Khuyên dùng để deploy)
* **Node.js** (v18.x trở lên - nếu chạy local)
* **Git**

---

## ⚙️ Cài đặt & Triển khai

### 1. Chạy bằng Docker (Production)

Đây là cách được khuyến nghị để triển khai hệ thống ổn định. Frontend đã được đóng gói kèm server Next.js bên trong container.

**Bước 1: Tạo file `docker-compose.yml`**

```yaml
version: '3.8'

services:
  web-admin:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        # Thay localhost bằng IP Public VPS/API Gateway nếu deploy thật
        - NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3000
    container_name: green-aqi-admin
    ports:
      - "3005:3005" 
    restart: always
````

**Bước 2: Build và chạy container**

```bash
docker-compose up -d --build
```

Sau khi chạy xong, truy cập Web Admin tại: `http://localhost:3005`

### 2\. Chạy môi trường phát triển (Local)

**Bước 1: Clone dự án**

```bash
git clone [https://github.com/tannguyen1129/UMT.FreeFireFiles-webdashboard.git](https://github.com/tannguyen1129/UMT.FreeFireFiles-webdashboard.git)
cd UMT.FreeFireFiles-webdashboard
```

**Bước 2: Cài đặt dependencies**

```bash
npm install
```

**Bước 3: Cấu hình biến môi trường**
Tạo file `.env` (xem mục Cấu hình bên dưới).

**Bước 4: Chạy server dev**

```bash
npm run dev
```

Truy cập tại: `http://localhost:3005` (hoặc port mặc định của Next.js).

-----

## 🔧 Cấu hình

Tạo file `.env` (hoặc `.env.local` khi chạy dev) tại thư mục gốc với nội dung sau:

```env
# URL của API Gateway (Backend NestJS)
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3000

# Port cho Next.js server (Optional, default 3000)
PORT=3005
```

-----

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh\! Nếu bạn muốn cải thiện dự án:

1.  Fork dự án này.
2.  Tạo nhánh tính năng mới (`git checkout -b feature/TenTinhNang`).
3.  Commit thay đổi của bạn (`git commit -m 'Thêm tính năng XYZ'`).
4.  Push lên nhánh (`git push origin feature/TenTinhNang`).
5.  Tạo một Pull Request mới.

-----

## ✍️ Tác giả

**Team UMT.FreeFireFiles** - Đại học Quản lý và Công nghệ Thành phố Hồ Chí Minh

  * **Lead Developer:** Sơn Tân
  * **AI Engineer:** Võ Ngọc Trâm Anh
  * **Frontend Developer:** Phan Nguyễn Duy Kha
  * **Email:** tandtnt15@gmail.com

**Hệ sinh thái Repositories:**

  * [Backend Microservices](https://github.com/tannguyen1129/UMT.FreeFireFlies)
  * [Mobile App (Citizen)](https://github.com/tannguyen1129/UMT.FreeFireFlies-frontend.git)
  * [Web Dashboard (Admin)](https://github.com/tannguyen1129/UMT.FreeFireFiles-webdashboard.git)

## 📄 Giấy phép

Distributed under the Apache 2.0 License. See `LICENSE` for more information.