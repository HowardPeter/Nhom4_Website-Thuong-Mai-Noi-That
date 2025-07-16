'use client'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useEffect, useState } from 'react'

export default function ObjectDetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [ip, setIp] = useState<string>('')

  // Lấy IP của người dùng (nếu cần)
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('Unknown'))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult([]) // reset result
    }
  }

  const handleSubmit = () => {
    if (!file) return alert('Vui lòng chọn một file!')

    // Giả lập kết quả nhận diện
    const detected = [
      'Object: person - 98%',
      'Object: car - 87%',
      'Object: dog - 78%',
    ]

    // Giả lập xử lý sau 1 giây
    setTimeout(() => {
      setResult(detected)
      setImagePreview(URL.createObjectURL(file)) // hiển thị ảnh sau khi xử lý

      const currentHistory = JSON.parse(localStorage.getItem('detectionHistory') || '[]')

      const newEntry = {
        id: Date.now(),
        fileName: file.name,
        format: file.name.slice(file.name.lastIndexOf('.')),
        time: new Date().toLocaleString(),
        action: 'detect object',
        result: detected,
        ip: ip || 'Unknown',
      }

      const updatedHistory = [newEntry, ...currentHistory]
      localStorage.setItem('detectionHistory', JSON.stringify(updatedHistory))
    }, 1000)
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6fa]">
      <div className="w-60 shadow-lg">
        <Sidebar />
      </div>

      <main className="flex-1 p-5">
        <div className="bg-[#172B4D] shadow-md p-2 mb-6">
          <Header title="Object Detection" />
        </div>

        <div className="p-6 bg-white rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#172B4D]">Gửi ảnh hoặc video</h2>

          <div className="border-2 border-dashed border-blue-400 p-8 rounded-lg text-center">
            <p className="text-gray-400 mb-4 text-sm">
              Kéo thả tệp vào đây hoặc chọn từ máy
            </p>

            <div className="flex flex-col items-center">
              <label
                htmlFor="file-upload"
                className="cursor-pointer border border-black px-4 py-1 bg-gray-200 text-black text-sm rounded hover:bg-gray-300 transition"
              >
                Chọn tệp
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-gray-400 text-sm mt-2">
                {file ? file.name : 'Chưa chọn tệp'}
              </span>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 text-base rounded-lg shadow hover:bg-blue-700 transition"
              >
                Bắt đầu xử lý
              </button>
            </div>
          </div>
        </div>

        {/* Kết quả */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#172B4D]">Kết quả nhận diện</h2>

          {imagePreview && (
            <div className="flex justify-center mb-6">
              <img
                src={imagePreview}
                alt="Kết quả"
                className="w-auto max-h-64 border rounded shadow"
              />
            </div>
          )}

          <div className="bg-gray-50 p-5 rounded-lg min-h-[120px]">
            {result.length === 0 ? (
              <p className="text-gray-500 italic text-center">Chưa có kết quả</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-gray-800">
                {result.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
