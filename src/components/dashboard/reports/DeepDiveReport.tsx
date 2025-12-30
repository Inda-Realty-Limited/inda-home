import { FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaChartArea } from 'react-icons/fa';

export interface ReportData {
    id: string;
    client: string;
    analyst: string;
    date: string;
    summary: {
        securityScore: string;
        marketValue: string;
        appreciation: string;
        verdict: string;
    };
    keyFindings: string[];
    legal: Array<{ label: string; status: 'Valid' | 'Pending' | 'Flagged'; subtext: string }>;
    survey: Array<{ label: string; status: 'Valid' | 'Pending' | 'Flagged'; subtext: string }>;
    verdict: {
        status: 'PASSED' | 'FAILED' | 'CAUTION';
        message: string;
    };
}

export default function DeepDiveReport({ data }: { data: ReportData }) {
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

            <div className="bg-inda-dark p-8 text-white relative">
                <div className="absolute top-8 right-8 text-right">
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Report ID</p>
                    <p className="text-lg font-bold tracking-tight text-inda-teal">{data.id}</p>
                </div>
                <h2 className="text-3xl font-bold mb-2">Inda Deep Dive™</h2>
                <p className="text-sm opacity-80 max-w-sm">
                    Comprehensive Property Authentication & Market Valuation Report for <span className="font-bold">{data.client}</span>.
                </p>
                <div className="flex gap-4 mt-8">
                    <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                        <p className="text-[10px] uppercase opacity-60">Security Score</p>
                        <p className="text-lg font-bold text-inda-teal">{data.summary.securityScore}</p>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                        <p className="text-[10px] uppercase opacity-60">Market Value</p>
                        <p className="text-lg font-bold">{data.summary.marketValue}</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FaShieldAlt className="text-inda-teal" /> Key Verification Findings
                        </h3>
                        <ul className="space-y-3">
                            {data.keyFindings.map((finding, i) => (
                                <li key={i} className="flex gap-3 text-sm text-inda-dark bg-inda-light p-3 rounded-lg border border-inda-teal/10">
                                    <div className="mt-1"><FaCheckCircle className="text-inda-teal shrink-0" /></div>
                                    {finding}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[#F8FAFC] p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                        <FaShieldAlt className="text-4xl text-inda-teal mb-4" />
                        <p className="text-xs uppercase font-bold text-gray-500 mb-1">Final Verdict</p>
                        <p className={`text-xl font-black ${data.verdict.status === 'PASSED' ? 'text-green-600' : 'text-red-500'}`}>
                            {data.verdict.status}
                        </p>
                        <p className="text-[10px] mt-2 text-gray-500 leading-relaxed italic">
                            "{data.verdict.message}"
                        </p>
                    </div>
                </div>

                <div className="space-y-10">
                    <div>
                        <h4 className="text-inda-dark font-black text-lg mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
                            1.0 Legal & Title Authentication
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.legal.map((item, i) => (
                                <StatusCard key={i} {...item} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-inda-dark font-black text-lg mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
                            2.0 Survey & Boundary Controls
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.survey.map((item, i) => (
                                <StatusCard key={i} {...item} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between uppercase font-medium tracking-wider">
                    <div>Generated by {data.analyst} on {data.date}</div>
                    <div>© Inda Realty Limited - All Rights Reserved</div>
                </div>
            </div>
        </div>
    );
}

function StatusCard({ label, status, subtext }: { label: string; status: string; subtext: string }) {
    const isPending = status === 'Pending';
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${isPending ? 'bg-yellow-400 animate-pulse' : 'bg-inda-teal'}`} />
            <div>
                <h5 className="text-sm font-bold text-inda-dark">{label}</h5>
                <p className="text-[10px] text-gray-500 mb-2">{subtext}</p>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isPending ? 'bg-yellow-50 text-yellow-600' : 'bg-inda-teal/10 text-inda-teal'
                    }`}>
                    {status}
                </span>
            </div>
        </div>
    );
}
