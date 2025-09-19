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
  SunIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Laden...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const adminLinks = [
    {
      title: 'Nieuw Artikel',
      href: '/admin/nieuwe-artikel',
      icon: PlusCircleIcon,
      description: 'Maak en publiceer een nieuw artikel',
      color: 'bg-blue-500'
    },
    {
      title: 'Artikelen Beheer',
      href: '/admin/artikelen',
      icon: NewspaperIcon,
      description: 'Beheer bestaande artikelen',
      color: 'bg-indigo-500'
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
      description: 'Beheer verkeersmeldingen',
      color: 'bg-orange-500'
    },
    {
      title: 'Weerwaarschuwingen',
      href: '/admin/weather-alerts',
      icon: SunIcon,
      description: 'Beheer weerwaarschuwingen',
      color: 'bg-cyan-500'
    },
    {
      title: 'Bedrijvengids',
      href: '/admin/bedrijven',
      icon: BuildingStorefrontIcon,
      description: 'Beheer bedrijven en categorieën',
      color: 'bg-green-500'
    },
    {
      title: 'Advertenties',
      href: '/admin/ads',
      icon: MegaphoneIcon,
      description: 'Beheer advertenties en banners',
      color: 'bg-yellow-500'
    },
    {
      title: 'Gebruikers',
      href: '/admin/users',
      icon: UserGroupIcon,
      description: 'Beheer gebruikers en rollen',
      color: 'bg-purple-500',
      adminOnly: true
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      description: 'Bekijk statistieken',
      color: 'bg-indigo-500',
      adminOnly: true
    }
  ]

  const filteredLinks = adminLinks.filter(link =>
    !link.adminOnly || session?.user?.role === 'ADMIN'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="text-sm text-gray-500">
                Welkom, {session?.user?.name || session?.user?.email}
              </span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <EyeIcon className="h-5 w-5" />
              Bekijk Website
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Beheer Functies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-all p-5 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${link.color} p-2 rounded-lg text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {link.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Snelle Acties</h2>
            <div className="space-y-3">
              <Link
                href="/admin/nieuwe-artikel"
                className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium text-blue-900">Nieuw artikel schrijven</span>
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/admin/events"
                className="flex items-center justify-between p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium text-pink-900">Evenement toevoegen</span>
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/admin/traffic"
                className="flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium text-orange-900">Verkeersinformatie toevoegen</span>
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recente Activiteit</h2>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Alle systemen operationeel</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DocumentTextIcon className="h-4 w-4 mr-3 text-gray-400" />
                <span>Laatste artikel: vandaag</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarDaysIcon className="h-4 w-4 mr-3 text-gray-400" />
                <span>Komende evenementen: 5</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <TruckIcon className="h-4 w-4 mr-3 text-gray-400" />
                <span>Actieve verkeersmeldingen: 2</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="text-blue-900 font-medium">Tip: Gebruik de snelle acties voor veelgebruikte taken</p>
              <p className="text-blue-700 mt-1">
                Voor hulp of vragen, neem contact op met de systeembeheerder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}