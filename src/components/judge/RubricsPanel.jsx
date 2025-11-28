import { FileText, CheckCircle2 } from 'lucide-react'

export default function RubricsPanel() {
  const rubricCategories = [
    {
      category: "Presentation Quality (10 points)",
      criteria: [
        "Clarity and organization of presentation (3 points)",
        "Professional delivery and communication (3 points)",
        "Visual aids quality (2 points)",
        "Time management (2 points)"
      ]
    },
    {
      category: "Feasibility (10 points)",
      criteria: [
        "Technical feasibility of solution (4 points)",
        "Resource requirements and availability (3 points)",
        "Implementation timeline (3 points)"
      ]
    },
    {
      category: "Innovation (10 points)",
      criteria: [
        "Creativity and originality (4 points)",
        "Novel approach to problem-solving (3 points)",
        "Potential for impact (3 points)"
      ]
    },
    {
      category: "Analysis Depth (10 points)",
      criteria: [
        "Thoroughness of problem analysis (4 points)",
        "Use of data and evidence (3 points)",
        "Critical thinking demonstrated (3 points)"
      ]
    },
    {
      category: "Recommendations (10 points)",
      criteria: [
        "Quality and practicality of recommendations (4 points)",
        "Actionable next steps (3 points)",
        "Long-term strategic value (3 points)"
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Scoring Rubrics</h2>
        <p className="text-gray-600">Guidelines for evaluating team submissions</p>
      </div>

      <div className="space-y-6">
        {rubricCategories.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-tamu-maroon" />
              <h3 className="text-xl font-semibold text-gray-800">{category.category}</h3>
            </div>
            <ul className="space-y-2">
              {category.criteria.map((criterion, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">Total Possible Score: 50 points</h4>
        <p className="text-sm text-blue-800">
          Each category is scored on a scale of 0-10. Use the sliders in the Scoring Dashboard to assign points based on the criteria above.
        </p>
      </div>
    </div>
  )
}

