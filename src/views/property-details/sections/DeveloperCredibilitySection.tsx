import { Building2, TrendingUp, Award, CheckCircle } from "lucide-react";

const projectHistory = [
  { name: "Novo Heights", year: "2022", units: 450, status: "Completed", delivery: "On time" },
  { name: "Citadel Estate", year: "2020", units: 680, status: "Completed", delivery: "On time" },
  { name: "Millionaire's Paradise", year: "2018", units: 320, status: "Completed", delivery: "1 month delay" },
  { name: "Greenspring Estate", year: "2016", units: 550, status: "Completed", delivery: "On time" },
  { name: "Royal Gardens", year: "2014", units: 280, status: "Completed", delivery: "On time" }
];

const ratings = [
  { category: "Quality Construction", score: 4.9 },
  { category: "Timely Delivery", score: 4.7 },
  { category: "Customer Service", score: 4.8 },
  { category: "Transparency", score: 4.9 }
];

export function DeveloperCredibilitySection() {
  return (
    <div className="space-y-6">
      {/* Developer Score Card */}
      <div className="bg-gradient-to-br from-[#50b8b1] to-[#45a69f] rounded-lg p-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white mb-2">Landwey Investment Ltd</h3>
            <p className="text-white/90 text-sm">Est. 2008 • 15+ Years Experience</p>
          </div>
          <div className="text-center bg-white/20 rounded-lg px-4 py-2">
            <div className="text-3xl mb-1">4.8</div>
            <div className="text-xs">out of 5.0</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl mb-1">3,000+</div>
            <div className="text-sm text-white/90">Completed Units</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl mb-1">92%</div>
            <div className="text-sm text-white/90">On-Time Delivery</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl mb-1">₦12.5B</div>
            <div className="text-sm text-white/90">Annual Revenue</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl mb-1">AA-</div>
            <div className="text-sm text-white/90">Credit Rating</div>
          </div>
        </div>
      </div>

      {/* Ratings Breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Performance Ratings</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">Based on 847 verified buyer reviews</p>
        
        <div className="space-y-3">
          {ratings.map((rating, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{rating.category}</span>
                <span className="text-[#50b8b1]">{rating.score}/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#50b8b1] h-2 rounded-full transition-all"
                  style={{ width: `${(rating.score / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project History Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Project Track Record</h4>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Project</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Year</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Units</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projectHistory.map((project, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{project.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{project.year}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{project.units}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        <CheckCircle className="w-3 h-3" />
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${
                        project.delivery === "On time" ? "text-green-600" : "text-yellow-600"
                      }`}>
                        {project.delivery}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Financial Stability */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Financial Stability</h4>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span><strong>₦12.5B annual revenue</strong> with consistent growth</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span><strong>AA- credit rating (stable)</strong> from major rating agencies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span><strong>Zero bankruptcy filings</strong> throughout 15-year history</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span>
              <strong>Banking relationships</strong> with{" "}
              <button
                onClick={() => window.open('https://forms.gle/gtbank-mortgage', '_blank')}
                className="text-[#50b8b1] hover:underline"
              >
                GTBank
              </button>
              ,{" "}
              <button
                onClick={() => window.open('https://forms.gle/access-mortgage', '_blank')}
                className="text-[#50b8b1] hover:underline"
              >
                Access
              </button>
              , Sterling,{" "}
              <button
                onClick={() => window.open('https://forms.gle/stanbic-mortgage', '_blank')}
                className="text-[#50b8b1] hover:underline"
              >
                Stanbic IBTC
              </button>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}