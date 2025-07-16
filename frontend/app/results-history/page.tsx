'use client'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useEffect, useState } from 'react'

export default function ResultsHistoryPage() {
  const [allData, setAllData] = useState<any[]>([])
  const [searchKey, setSearchKey] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const itemsPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]')
    setAllData(history)
  }, [])

  const filteredData = allData.filter(item => {
    const matchesKey =
      item.fileName?.toLowerCase().includes(searchKey.toLowerCase()) ||
      item.action?.toLowerCase().includes(searchKey.toLowerCase()) ||
      item.time?.toLowerCase().includes(searchKey.toLowerCase())

    const matchesDate =
      (!startDate || new Date(item.time) >= new Date(startDate)) &&
      (!endDate || new Date(item.time) <= new Date(endDate))

    return matchesKey && matchesDate
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handlePrevious = () => setCurrentPage(p => Math.max(p - 1, 1))
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages))

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    const updated = allData.filter(item => !selectedIds.includes(item.id))
    setAllData(updated)
    setSelectedIds([])
    localStorage.setItem('detectionHistory', JSON.stringify(updated))
  }

  const handleDownloadDemoData = () => {
    const demo = {
      id: Date.now(),
      time: new Date().toLocaleString(),
      action: 'upload image',
      fileName: 'demo.png',
      format: '.png',
      result: ['Object: person - 90%'],
      ip: '192.168.1.200',
    }

    const blob = new Blob([JSON.stringify(demo, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `demo_result_${demo.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6fa]">
      <div className="w-60 shadow-lg">
        <Sidebar />
      </div>
      <main className="flex-1 p-5">
        <div className="bg-[#172B4D] shadow-md p-2 mb-4">
          <Header title="Lịch sử tương tác" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          {/* Thanh công cụ */}
          <div className="flex flex-wrap justify-between items-start mb-6">
            {/* Bên trái: Tiêu đề và nút */}
            <div className="flex flex-col space-y-2">
              <div className="text-xl font-semibold text-gray-800">Lịch sử</div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadDemoData}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                >
                  Tải dữ liệu demo
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  disabled={selectedIds.length === 0}
                >
                  Xóa đã chọn
                </button>
              </div>
            </div>

            {/* Bên phải: ô tìm kiếm & ngày */}
            <div className="flex gap-4 w-full md:w-2/3 mt-4 md:mt-0 justify-end">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên file, thao tác, thời gian..."
                className="border border-gray-300 p-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <input
                type="datetime-local"
                className="border border-gray-300 p-2 rounded-lg"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="datetime-local"
                className="border border-gray-300 p-2 rounded-lg"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="py-3 px-2 text-sm text-gray-600">✓</th>
                <th className="py-3 px-2 text-sm text-gray-600">STT</th>
                <th className="py-3 px-2 text-sm text-gray-600">Thời gian</th>
                <th className="py-3 px-2 text-sm text-gray-600">Thao tác</th>
                <th className="py-3 px-2 text-sm text-gray-600">Tên file</th>
                <th className="py-3 px-2 text-sm text-gray-600">Định dạng</th>
                <th className="py-3 px-2 text-sm text-gray-600">Kết quả</th>
                <th className="py-3 px-2 text-sm text-gray-600">Chi tiết</th>
                <th className="py-3 px-2 text-sm text-gray-600">IP / Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  <td className="py-2 px-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="py-2 px-2">{startIndex + index + 1}</td>
                  <td className="py-2 px-2">{item.time}</td>
                  <td className="py-2 px-2">{item.action}</td>
                  <td className="py-2 px-2">{item.fileName}</td>
                  <td className="py-2 px-2">{item.format}</td>
                  <td
                    className="py-2 px-2 font-semibold"
                    style={{ color: item.result?.length > 0 ? '#10B981' : '#EF4444' }}
                  >
                    {item.result?.length > 0 ? 'Thành công' : 'Thất bại'}
                  </td>
                  <td className="py-2 px-2">
                    <button
                      onClick={() =>
                        alert(
                          item.result?.length > 0
                            ? item.result.join('\n')
                            : 'Không có kết quả'
                        )
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                  <td className="py-2 px-2">{item.ip || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
