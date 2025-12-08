/*
 * Copyright 2025 Green-AQI Navigator Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


'use client';
import { useEffect, useState } from 'react';
import { 
  IncidentType, 
  fetchIncidentTypes, 
  createIncidentType, 
  updateIncidentType, 
  deleteIncidentType 
} from './incidentTypeService';

export default function IncidentTypesPage() {
  const [types, setTypes] = useState<IncidentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Biến cho form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- Tải dữ liệu ---
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchIncidentTypes();
      setTypes(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Xóa Form ---
  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingId(null);
  };

  // --- Xử lý Submit (Tạo mới hoặc Cập nhật) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const data = { type_name: name, description: description };

    try {
      if (editingId) {
        // Cập nhật
        await updateIncidentType(editingId, data);
      } else {
        // Tạo mới
        await createIncidentType(data);
      }
      resetForm();
      await loadData(); // Tải lại bảng
    } catch (err: any) {
      setError(err.message || 'Thao tác thất bại');
    }
  };

  // --- Xử lý Sửa (Edit) ---
  const handleEdit = (type: IncidentType) => {
    setEditingId(type.type_id);
    setName(type.type_name);
    setDescription(type.description);
  };

  // --- Xử lý Xóa (Delete) ---
  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại sự cố này? (Các báo cáo liên quan có thể bị lỗi)')) {
      try {
        await deleteIncidentType(id);
        await loadData(); // Tải lại bảng
      } catch (err: any) {
        setError(err.message || 'Xóa thất bại');
      }
    }
  };

  if (isLoading) return <div className="p-8">Đang tải...</div>;

  // --- Giao diện (Form + Table) ---
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý Loại Sự cố</h1>
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      {/* FORM TẠO MỚI / SỬA */}
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow mb-6 space-y-4">
        <h2 className="text-xl font-semibold">{editingId ? 'Chỉnh sửa Loại Sự cố' : 'Tạo Loại Sự cố Mới'}</h2>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên Loại Sự cố (Bắt buộc)</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả (Tùy chọn)</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            {editingId ? 'Cập nhật' : 'Tạo mới'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* BẢNG HIỂN THỊ */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {types.map((type) => (
              <tr key={type.type_id}>
                <td className="px-6 py-4 text-sm text-gray-900">{type.type_id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{type.type_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{type.description}</td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(type)} className="text-green-600 hover:text-green-900">Sửa</button>
                  <button onClick={() => handleDelete(type.type_id)} className="text-red-600 hover:text-red-900">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}