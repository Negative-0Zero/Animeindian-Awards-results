'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti' // optional – install with `npm install canvas-confetti`
import { supabase } from '@/utils/supabase/client'
import { Trophy, Award, Star } from 'lucide-react'

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [groupedResults, setGroupedResults] = useState<Record<string, any[]>>({})

  useEffect(() => {
    fetchResults()
  }, [])

  async function fetchResults() {
    setLoading(true)
    const { data, error } = await supabase
      .from('results')
      .select('*, nominees(title, anime_name)') // join to get nominee details
      .order('category')
      .order('rank')

    if (!error && data) {
      setResults(data)
      // Group by category
      const grouped = data.reduce((acc, r) => {
        if (!acc[r.category]) acc[r.category] = []
        acc[r.category].push(r)
        return acc
      }, {} as Record<string, any[]>)
      setGroupedResults(grouped)

      // Trigger confetti on first load (optional)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    }
    setLoading(false)
  }

  const medalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return ''
  }

  const medalColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-amber-600 to-amber-800'
    return ''
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto text-center">Loading results...</div>
      </main>
    )
  }

  if (results.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
            Results Not Yet Available
          </h1>
          <p className="text-gray-400">Winners will be announced after the voting deadline.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
        >
          🏆 WINNERS 🏆
        </motion.h1>

        {Object.entries(groupedResults).map(([category, items], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Trophy className="text-yellow-400" />
              {category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: catIndex * 0.2 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`relative bg-gradient-to-br ${medalColor(
                      item.rank
                    )} to-slate-900 rounded-2xl p-6 border border-white/10 shadow-xl overflow-hidden`}
                  >
                    {/* Medal icon */}
                    <div className="absolute top-2 right-2 text-6xl opacity-30">
                      {medalEmoji(item.rank)}
                    </div>

                    {item.nominees?.image_url && (
                      <img
                        src={item.nominees.image_url}
                        alt={item.nominees.title}
                        className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-white/20"
                      />
                    )}
                    <h3 className="text-2xl font-bold text-center mb-2">
                      {item.nominees?.title}
                    </h3>
                    {item.nominees?.anime_name && (
                      <p className="text-center text-sm text-white/70 mb-4">
                        {item.nominees.anime_name}
                      </p>
                    )}

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Public votes</span>
                        <span className="font-bold">{item.public_votes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jury votes</span>
                        <span className="font-bold">{item.jury_votes}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-white/20 pt-2 mt-2">
                        <span>Final score</span>
                        <span>{item.final_score?.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
  }
