'use client'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="bg-[#172B4D] shadow-md p-3">
      <h1 className="text-3xl font-bold text-[#A7EBF2] text-center">
        {title}
      </h1>
    </div>
  )
}
