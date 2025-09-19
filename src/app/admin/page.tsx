'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  NewspaperIcon,
  UserGroupIcon,
  MegaphoneIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  TruckIcon,
  SunIcon
} from '@heroicons/react/24/outline'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'EDITOR' && session?.user?.role !== 'MODERATOR') {
      router.push('/')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Laden...</div>
      </div>
    )
  }

  const adminLinks = [
    {
      title: 'Artikelen',
      href: '/admin/articles',
      icon: NewspaperIcon,
      description: 'Beheer artikelen, categorieën en tags',
      color: 'bg-blue-500'
    },
    {
      title: 'Gebruikers',
      href: '/admin/users',
      icon: UserGroupIcon,
      description: 'Beheer gebruikers en hun rollen',
      color: 'bg-purple-500',
      adminOnly: true
    },
    {
      title: 'Advertenties',
      href: '/admin/ads',
      icon: MegaphoneIcon,
      description: 'Beheer advertenties en banners',
      color: 'bg-green-500'
    },
    {
      title: 'Bedrijvengids',
      href: '/admin/bedrijven',
      icon: BuildingStorefrontIcon,
      description: 'Beheer bedrijven en categorieën',
      color: 'bg-yellow-500'
    },
    {
      title: 'Evenementen',
      href: '/admin/events',
      icon: CalendarDaysIcon,
      description: 'Beheer evenementen en activiteiten',
      color: 'bg-pink-500'
    },
    {
      title: 'Verkeersinformatie',
      href: '/admin/traffic',
      icon: TruckIcon,
      description: 'Beheer verkeersinformatie en wegwerkzaamheden',
      color: 'bg-orange-500'
    },
    {
      title: 'Weerwaarschuwingen',
      href: '/admin/weather-alerts',
      icon: SunIcon,
      description: 'Beheer weerwaarschuwingen en alerts',
      color: 'bg-cyan-500'
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      description: 'Bekijk statistieken en analytics',
      color: 'bg-indigo-500',
      adminOnly: true
    }
  ]

  const filteredLinks = adminLinks.filter(link =>
    !link.adminOnly || session?.user?.role === 'ADMIN'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welkom {session?.user?.name || session?.user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${link.color} p-3 rounded-lg text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Snelle Acties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/articles/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              Nieuw Artikel
            </Link>
            <Link
              href="/admin/events/new"
              className="bg-pink-600 text-white px-4 py-2 rounded-lg text-center hover:bg-pink-700 transition-colors"
            >
              Nieuw Evenement
            </Link>
            <Link
              href="/admin/traffic/new"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg text-center hover:bg-orange-700 transition-colors"
            >
              Nieuwe Verkeersinformatie
            </Link>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Terug naar website
          </Link>
        </div>
      </div>
    </div>
  )
}