'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/dash-board', label: 'Dash board' },
    { href: '/object-detection', label: 'Object Detection' },
    { href: '/operation-history', label: 'Operation History' },
    { href: '/results-history', label: 'Results History' },
  ]

  return (
    <div className="bg-[#172B4D] w-60 h-full p-5 fixed">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#A7EBF2]">
        OBJ-DETECTION
      </h2>
      <nav className="flex flex-col gap-4 text-md text-white">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              'hover:text-yellow-300',
              pathname === link.href ? 'text-yellow-300 font-bold' : 'text-white'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
