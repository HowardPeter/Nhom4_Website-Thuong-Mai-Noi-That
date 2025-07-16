'use client'


import Header from '@/components/Header'
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from 'react'

interface DetectionResult{
  id: number
  fileName: string
  time: string
  result: string[]
}



export default function OperationHistoryPage() {


    const [history, setHistory] = useState<DetectionResult[]>([])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('detectionHistory') || '[]')
        setHistory(data);
    }, [])


    return (
        <div className="flex min-h-screen bg-[#f4f6fa]">
            <div className="w-60 shadow-lg ">
                <Sidebar />
            </div>
            <main className="flex-1 p-5">
                <div className="bg-[#172B4D] shadow-md p-2 ">
                    <h1 className="text-3xl font-bold text-[#A7EBF2] text-center">
                        <Header title={"Operation History"} />
                    </h1>
                </div>
                {/* lich su */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] mt-8">
                    {history.length === 0 ? (
                        <p className="text-gray-500 italic">Chưa có kết quả nào</p>
                    ) : (
                        history.map((item) => (
                        <div key={item.id} className="rounded shadow p-4 bg-white">
                            <h2 className="font-semibold">{item.fileName}</h2>
                            <p className="text-sm text-gray-400">{item.time}</p>
                            <p className="mt-2 text-gray-400 text-sm">
                            {item.result.join(', ')}
                            </p>
                            <button className="mt-3 bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600">
                            Xem chi tiết
                            </button>
                        </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}