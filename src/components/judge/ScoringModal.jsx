import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Loader2, CheckCircle2, Link2 } from 'lucide-react'

const SCORING_CATEGORIES = [
  { id: 'presentation', label: 'Presentation Quality', max: 10 },
  { id: 'feasibility', label: 'Feasibility', max: 10 },
  { id: 'innovation', label: 'Innovation', max: 10 },
  { id: 'analysis', label: 'Analysis Depth', max: 10 },
  { id: 'recommendations', label: 'Recommendations', max: 10 },
]

export default function ScoringModal({ team, onClose, onSave }) {
  const [scores, setScores] = useState({
    presentation: 0,
    feasibility: 0,
    innovation: 0,
    analysis: 0,
    recommendations: 0,
  })
  const [comments, setComments] = useState('')
  const [totalScore, setTotalScore] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const updateScore = (category, value) => {
    const newScores = { ...scores, [category]: parseFloat(value) }
    setScores(newScores)
    const total = Object.values(newScores).reduce((sum, val) => sum + val, 0)
    setTotalScore(total)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    // Simulate "Saving to Blockchain..." loading state
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSaving(false)
    setSaveSuccess(true)
    
    // Wait a moment to show success, then save and close
    setTimeout(() => {
      onSave({
        ...scores,
        total: totalScore,
        comments,
        scoredAt: new Date().toISOString(),
      })
      setSaveSuccess(false)
    }, 1000)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Score Team</h2>
              <p className="text-gray-600 mt-1">{team.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Total Score Display */}
            <div className="bg-gradient-to-r from-tamu-maroon to-tamu-maroon-light text-white rounded-lg p-6 text-center">
              <p className="text-sm font-medium opacity-90 mb-2">Total Score</p>
              <p className="text-5xl font-bold">{totalScore.toFixed(1)}</p>
              <p className="text-sm opacity-90 mt-2">out of {SCORING_CATEGORIES.length * 10}</p>
            </div>

            {/* Scoring Categories */}
            <div className="space-y-6">
              {SCORING_CATEGORIES.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-lg font-semibold text-gray-800">
                      {category.label}
                    </label>
                    <span className="text-2xl font-bold text-tamu-maroon">
                      {scores[category.id].toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={category.max}
                    step="0.1"
                    value={scores[category.id]}
                    onChange={(e) => updateScore(category.id, e.target.value)}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #500000 0%, #500000 ${(scores[category.id] / category.max) * 100}%, #e5e7eb ${(scores[category.id] / category.max) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span>
                    <span>{category.max}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comments */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Judge's Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide feedback and comments for this team..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
            {/* Saving to Blockchain Status */}
            <AnimatePresence>
              {isSaving && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5 text-blue-600" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Saving to Blockchain...</p>
                      <p className="text-xs text-blue-700">Securing your score with cryptographic validation</p>
                    </div>
                    <Link2 className="w-4 h-4 text-blue-600" />
                  </div>
                </motion.div>
              )}
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Score saved successfully!</p>
                      <p className="text-xs text-green-700">Transaction confirmed on blockchain</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isSaving}
                className={`px-6 py-2 border border-gray-300 rounded-lg font-medium transition-colors ${
                  isSaving 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <motion.button
                whileHover={!isSaving ? { scale: 1.05 } : {}}
                whileTap={!isSaving ? { scale: 0.95 } : {}}
                onClick={handleSave}
                disabled={isSaving || saveSuccess}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isSaving || saveSuccess
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-tamu-maroon text-white hover:bg-tamu-maroon-light'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Score
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

