# UMT FreeFireFiles - Web Dashboard

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-Maintained-orange.svg)

> **UMT.FreeFireFiles-webdashboard** là hệ thống quản trị (Admin Panel) được thiết kế để quản lý, lưu trữ và phân phối các tệp tin/tài nguyên cho dự án Free Fire Files của UMT.

## 📖 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Đóng góp](#-đóng-góp)
- [Tác giả](#-tác-giả)

---

## 📖 Giới thiệu

Dự án này cung cấp giao diện Web trực quan giúp các quản trị viên dễ dàng thao tác với cơ sở dữ liệu tệp tin game, quản lý người dùng và xem thống kê lượt tải xuống/truy cập theo thời gian thực.

## ✨ Tính năng chính

* **Quản lý người dùng (User Management):** Đăng nhập, phân quyền (Admin/Editor).
* **Quản lý Tệp tin (File Manager):**
    * Upload file cấu hình/skin/data.
    * Chỉnh sửa thông tin metadata (phiên bản, ngày cập nhật).
    * Xóa file lỗi thời.
* **Thống kê (Analytics):** Biểu đồ trực quan về lượng truy cập và tải xuống.
* **Tìm kiếm & Lọc:** Tìm nhanh các file theo từ khóa hoặc danh mục.
* **Giao diện Responsive:** Tương thích tốt trên cả Desktop và Mobile.

## 🛠 Công nghệ sử dụng

Dự án được xây dựng dựa trên các công nghệ:

**Frontend:**
* [React.js](https://reactjs.org/) / [Vue.js](https://vuejs.org/) *(Chọn 1 trong 2 tùy vào code thực tế của bạn)*
* [Tailwind CSS](https://tailwindcss.com/) hoặc [Bootstrap](https://getbootstrap.com/)
* Chart.js (Biểu đồ)

**Backend & Database (Nếu có tích hợp):**
* Node.js & Express
* MongoDB / MySQL / Firebase

## 📋 Yêu cầu hệ thống

Trước khi cài đặt, hãy đảm bảo máy tính của bạn đã cài đặt:

* [Node.js](https://nodejs.org/) (Phiên bản 16.x trở lên)
* [npm](https://www.npmjs.com/) hoặc [Yarn](https://yarnpkg.com/)
* Git

## ⚙️ Cài đặt

1.  **Clone dự án về máy:**

    ```bash
    git clone [https://github.com/tannguyen1129/UMT.FreeFireFiles-webdashboard.git](https://github.com/tannguyen1129/UMT.FreeFireFiles-webdashboard.git)
    cd UMT.FreeFireFiles-webdashboard
    ```

2.  **Cài đặt các gói phụ thuộc (Dependencies):**

    ```bash
    # Nếu dùng npm
    npm install

    # Nếu dùng yarn
    yarn install
    ```

## 🔧 Cấu hình

Tạo một file `.env` tại thư mục gốc của dự án và điền các thông tin cấu hình cần thiết (dựa trên file `.env.example` nếu có):

```env
# Ví dụ cấu hình
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME="UMT Dashboard"
# Thêm các API Key hoặc Database URL khác tại đây
````

## 🚀 Chạy ứng dụng

### Môi trường phát triển (Development)

Chạy lệnh sau để khởi động server local (thường là http://localhost:3000):

```bash
npm start
# hoặc
npm run dev
```

### Môi trường Production

Để build dự án ra file tĩnh (static files) để deploy lên hosting:

```bash
npm run build
```

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh\! Nếu bạn muốn cải thiện dự án, vui lòng làm theo các bước sau:

1.  Fork dự án này.
2.  Tạo nhánh tính năng mới (`git checkout -b feature/TenTinhNang`).
3.  Commit thay đổi của bạn (`git commit -m 'Thêm tính năng XYZ'`).
4.  Push lên nhánh (`git push origin feature/TenTinhNang`).
5.  Tạo một Pull Request mới.

## ✍️ Tác giả

 **Team UMT.FreeFireFiles** - Đại học Quản lý và Công nghệ Thành phố Hồ Chí Minh

* **Lead Developer:** Sơn Tân
* **AI Engineer:** Võ Ngọc Trâm Anh
* **Frontend Developer:** Phan Nguyễn Duy Kha
* **Email:** tandtnt15@gmail.com
* **Repository Backend:** [Backend Repo](https://github.com/tannguyen1129/UMT.FreeFireFlies)
* **Repository Frontend Citizen:** [Frontend Citizen Repo](https://github.com/tannguyen1129/UMT.FreeFireFiles-webdashboard.git)
* **Repository Frontend Admin Dashboard:** [Frontend Admin/Gov Repo](https://github.com/tannguyen1129/UMT.FreeFireFlies-frontend.git)

## 📄 Giấy phép

Distributed under the Apache 2.0 License. See `LICENSE` for more information.

```
```