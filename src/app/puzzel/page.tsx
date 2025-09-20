'use client'

import { useState } from 'react'
import BDCrossword from '@/components/crossword/BDCrossword'

export default function PuzzelPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  const handleComplete = (score: number, time: number) => {
    console.log(`Puzzle completed! Score: ${score}, Time: ${time}s`)
    // Later: save to database via API
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-blue font-newspaper mb-2">
            Kruiswoordpuzzel
          </h1>
          <p className="text-lg text-gray-600">
            Dagelijkse kruiswoordpuzzels van Barnevelds Dagblad
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-3">Kies je uitdaging:</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedDifficulty('easy')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDifficulty === 'easy'
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-gray-300 hover:border-brand-blue'
              }`}
            >
              <h3 className="font-bold mb-1">Makkelijk</h3>
              <p className="text-sm opacity-90">9x9 grid • 5-10 minuten</p>
            </button>
            <button
              onClick={() => setSelectedDifficulty('medium')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDifficulty === 'medium'
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-gray-300 hover:border-brand-blue'
              }`}
            >
              <h3 className="font-bold mb-1">Gemiddeld</h3>
              <p className="text-sm opacity-90">13x13 grid • 15-20 minuten</p>
            </button>
            <button
              onClick={() => setSelectedDifficulty('hard')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDifficulty === 'hard'
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-gray-300 hover:border-brand-blue'
              }`}
            >
              <h3 className="font-bold mb-1">Moeilijk</h3>
              <p className="text-sm opacity-90">15x15 grid • 25-35 minuten</p>
            </button>
          </div>
        </div>

        {/* Crossword Component */}
        <BDCrossword
          key={selectedDifficulty}
          difficulty={selectedDifficulty}
          onComplete={handleComplete}
        />

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-brand-blue mb-3">Over onze puzzels</h2>
            <p className="text-gray-700 mb-3">
              Elke dag publiceren we drie nieuwe kruiswoordpuzzels met verschillende
              moeilijkheidsgraden. Onze puzzels bevatten vaak verwijzingen naar Barneveld
              en de regio Gelderland.
            </p>
            <p className="text-gray-700">
              De puzzels worden automatisch gegenereerd maar handmatig gecontroleerd
              op kwaliteit en oplosbaarheid.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-brand-blue mb-3">Scoreboard</h2>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Beste tijd vandaag:</span>
                <span>3:42</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Hoogste score:</span>
                <span>98 punten</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Puzzels opgelost:</span>
                <span>147</span>
              </div>
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-brand-yellow text-black rounded hover:opacity-90 font-semibold">
              Bekijk volledig scoreboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}