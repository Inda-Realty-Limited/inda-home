import { ReportData } from './DeepDiveReport';
import { FaUserCheck, FaCamera, FaClipboardCheck, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';

export interface DeeperReportData extends ReportData {
    sellerVerification: Array<{ label: string; value: string }>;
    physicalInspection: Array<{ label: string; value: string }>;
}

export default function DeeperDiveReport({ data }: { data: DeeperReportData }) {
    return (
        <div className="max-w-4xl mx-auto space-y-10">

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-12 text-center relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-inda-teal to-inda-dark"></div>
                <FaShieldAlt className="text-6xl text-inda-teal mx-auto mb-6" />
                <h2 className="text-4xl font-black text-inda-dark tracking-tight mb-2">Inda Deeper Dive™</h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    The world-standard in real estate due diligence. Including identity verification and
                    physical on-site inspection of property index <span className="text-inda-teal font-bold">{data.id}</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-black text-inda-dark flex items-center gap-2 mb-6 border-b pb-3 uppercase text-xs tracking-widest">
                        <FaUserCheck className="text-inda-teal" /> Seller KYC & Verification
                    </h3>
                    <div className="space-y-4">
                        {data.sellerVerification.map((item, i) => (
                            <DetailItem key={i} {...item} icon={FaIdCard} />
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-black text-inda-dark flex items-center gap-2 mb-6 border-b pb-3 uppercase text-xs tracking-widest">
                        <FaCamera className="text-inda-teal" /> Physical Site Inspection
                    </h3>
                    <div className="space-y-4">
                        {data.physicalInspection.map((item, i) => (
                            <DetailItem key={i} {...item} icon={FaMapMarkerAlt} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-inda-dark p-8 rounded-2xl text-white flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-xl mb-1">On-Site Evidence</h4>
                    <p className="text-xs opacity-60">Inspection matched against master plan surveys.</p>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-14 w-20 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                            <FaCamera className="opacity-40" />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

function DetailItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1"><Icon className="text-inda-teal opacity-50" size={14} /></div>
            <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">{label}</p>
                <p className="text-sm font-bold text-inda-dark leading-tight">{value}</p>
            </div>
        </div>
    );
}

function FaShieldAlt(props: any) {
    return (
        <svg
            stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512"
            height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}
        >
            <path d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C25.3 92.1 16 110.1 16 130.1v171.2c0 144.3 90.7 270.5 225.4 312.4a48 48 0 0 0 29.2 0c134.7-41.9 225.4-168.1 225.4-312.4V130.1c0-20-9.3-38-29.5-46.4zM256 592c-1.3 0-2.6-.1-3.9-.3-113.1-35.2-189.1-140.4-189.1-260.5V148.1L256 67.2l193 80.9v183.1c0 120.1-76 225.3-189.1 260.5-1.3.2-2.6.3-3.9.3z"></path>
        </svg>
    );
}
