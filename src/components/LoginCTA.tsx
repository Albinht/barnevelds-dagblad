import Link from 'next/link'

// Mock 112 meldingen data
const emergencyAlerts = [
  {
    id: 1,
    type: 'Brandweer',
    location: 'Barneveld Centrum',
    description: 'Woningbrand Hoofdstraat',
    time: '14:32',
    priority: 'hoog'
  },
  {
    id: 2,
    type: 'Ambulance',
    location: 'Voorthuizen',
    description: 'Medische noodsituatie',
    time: '14:15',
    priority: 'normaal'
  },
  {
    id: 3,
    type: 'Politie',
    location: 'A1 Barneveld',
    description: 'Verkeersongeval',
    time: '13:58',
    priority: 'normaal'
  }
]

export default function LoginCTA() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-red-600">
          112 MELDINGEN
        </h3>
      </div>
      
      <div className="space-y-3">
        {emergencyAlerts.map((alert) => (
          <div 
            key={alert.id}
            className="relative border-l-4 border-red-500 pl-3 py-2 hover:bg-red-50 transition-colors"
          >
            {/* URGENT Badge in top-right corner */}
            {alert.priority === 'hoog' && (
              <div className="absolute top-2 right-2">
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-bold">
                  URGENT
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-1 pr-16">
              <span className="font-semibold text-red-700 text-sm uppercase">
                {alert.type}
              </span>
              <span className="text-xs text-gray-500">
                {alert.time}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {alert.description}
            </p>
            <p className="text-xs text-gray-600">
              {alert.location}
            </p>
          </div>
        ))}
      </div>
      
      <Link 
        href="/112-meldingen"
        className="block bg-red-600 text-white font-bold text-center py-2 px-4 rounded mt-4 hover:bg-red-700 transition-colors text-sm"
      >
        ALLE MELDINGEN →
      </Link>
      
      <div className="text-center mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
        </p>
      </div>
    </div>
  )
}