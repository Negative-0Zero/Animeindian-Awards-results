'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { supabase } from '@/utils/supabase/client'
import { Trophy, X } from 'lucide-react'

export default function ResultsPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [topThreeByCategory, setTopThreeByCategory] = useState<Record<string, any[]>>({})
  const [allNomineesByCategory, setAllNomineesByCategory] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState<Record<string, boolean>>({})
  const [selectedNominee, setSelectedNominee] = useState<any>(null)
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)

    try {
      // 1. Fetch all results (ranked winners) with nominee details
      const { data: resultsData, error: resultsError } = await supabase
        .from('results')
        .select('*, nominees(title, anime_name, image_url)')
        .order('category')
        .order('rank')

      if (resultsError) throw new Error(resultsError.message)

      // 2. Fetch all nominees (for full list)
      const { data: allNominees, error: nomineesError } = await supabase
        .from('nominees')
        .select('*')
        .order('created_at')

      if (nomineesError) throw new Error(nomineesError.message)

      // Group results by category (top 3 per category)
      const topThreeMap: Record<string, any[]> = {}
      const catSet = new Set<string>()
      resultsData?.forEach(r => {
        if (!topThreeMap[r.category]) topThreeMap[r.category] = []
        topThreeMap[r.category].push(r)
        catSet.add(r.category)
      })

      // Group all nominees by category
      const allMap: Record<string, any[]> = {}
      allNominees?.forEach(n => {
        if (!allMap[n.category]) allMap[n.category] = []
        allMap[n.category].push(n)
        catSet.add(n.category)
      })

      setCategories(Array.from(catSet).sort())
      setTopThreeByCategory(topThreeMap)
      setAllNomineesByCategory(allMap)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const scrollToCategory = (category: string) => {
    categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleShowAll = (category: string) => {
    setShowAll(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const handleNomineeClick = (nominee: any) => {
    // Find its result (if any) to get votes
    const result = topThreeByCategory[nominee.category]?.find(r => r.nominee_id === nominee.id)
    setSelectedNominee({ ...nominee, result })
  }

  const closeModal = () => setSelectedNominee(null)

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto text-center">Loading results...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error loading results</h1>
          <p className="text-gray-400">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-white/10 rounded-lg">
            Retry
          </button>
        </div>
      </main>
    )
  }

  if (categories.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
            Results Not Ready
          </h1>
          <p className="text-gray-400">Winners will be announced after the voting deadline.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Sticky category navigation */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
            🏆 Winners
          </h1>
          <div className="flex overflow-x-auto gap-2 pb-2 max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm whitespace-nowrap transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-16">
        {categories.map(category => {
          const topThree = topThreeByCategory[category] || []
          const allNominees = allNomineesByCategory[category] || []
          const winner = topThree[0] // rank 1
          const isShowingAll = showAll[category]

          return (
            <section
              key={category}
              ref={el => { categoryRefs.current[category] = el }}
              className="scroll-mt-24"
            >
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                <Trophy className="text-yellow-400" />
                {category}
              </h2>

              {/* Winner card (rank 1) */}
              {winner && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-yellow-900 via-purple-900 to-pink-900 rounded-3xl p-8 md:p-12 text-center border-4 border-yellow-400 shadow-2xl relative overflow-hidden mb-8"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300/20 via-transparent to-transparent" />
                  <p className="text-sm uppercase tracking-widest text-yellow-300 mb-2">
                    GRAND WINNER
                  </p>
                  <h2 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                    {winner.nominees?.title}
                  </h2>
                  {winner.nominees?.anime_name && (
                    <p className="text-xl text-white/80 mb-6">{winner.nominees.anime_name}</p>
                  )}
                  {winner.nominees?.image_url && (
                    <img
                      src={winner.nominees.image_url}
                      alt={winner.nominees.title}
                      className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-yellow-400 shadow-xl"
                    />
                  )}
                  <div className="flex justify-center gap-8 text-white/90 text-sm mb-8">
                    <div>
                      <span className="block text-2xl font-bold">{winner.public_votes}</span>
                      <span>Public Votes</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-bold">{winner.jury_votes}</span>
                      <span>Jury Votes</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-bold">{winner.final_score?.toFixed(1)}</span>
                      <span>Final Score</span>
                    </div>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => toggleShowAll(category)}
                    className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition"
                  >
                    {isShowingAll ? 'Hide Nominees' : 'Show All Nominees'}
                  </button>
                </motion.div>
              )}

              {/* All nominees (collapsible) */}
              <AnimatePresence>
                {isShowingAll && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">All Nominees</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {allNominees.map(nominee => {
                        const result = topThree.find(r => r.nominee_id === nominee.id)
                        const isTop3 = !!result
                        return (
                          <div
                            key={nominee.id}
                            onClick={() => handleNomineeClick(nominee)}
                            className={`bg-slate-800/50 rounded-xl p-4 text-center border ${
                              isTop3 ? 'border-yellow-500/50' : 'border-white/10'
                            } hover:border-yellow-400 transition cursor-pointer`}
                          >
                            {nominee.image_url && (
                              <img
                                src={nominee.image_url}
                                alt={nominee.title}
                                className="w-20 h-20 object-cover rounded-full mx-auto mb-3 border-2 border-white/20"
                              />
                            )}
                            <h4 className="font-bold text-sm md:text-base">{nominee.title}</h4>
                            {isTop3 && (
                              <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                                Rank #{result.rank}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )
        })}
      </div>

      {/* Modal for nominee details */}
      <AnimatePresence>
        {selectedNominee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 max-w-md w-full border-2 border-yellow-400 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="text-center">
                {selectedNominee.image_url && (
                  <img
                    src={selectedNominee.image_url}
                    alt={selectedNominee.title}
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-yellow-400"
                  />
                )}
                <h2 className="text-3xl font-bold mb-2">{selectedNominee.title}</h2>
                {selectedNominee.anime_name && (
                  <p className="text-gray-400 mb-4">{selectedNominee.anime_name}</p>
                )}
                {selectedNominee.result ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">Rank #{selectedNominee.result.rank}</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <div>
                        <span className="block text-xl font-bold">{selectedNominee.result.public_votes}</span>
                        <span>Public</span>
                      </div>
                      <div>
                        <span className="block text-xl font-bold">{selectedNominee.result.jury_votes}</span>
                        <span>Jury</span>
                      </div>
                      <div>
                        <span className="block text-xl font-bold">{selectedNominee.result.final_score?.toFixed(1)}</span>
                        <span>Score</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No vote data available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
               }
