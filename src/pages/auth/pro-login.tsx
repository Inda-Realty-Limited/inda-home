import { useState } from 'react';
import { useRouter } from 'next/router';
import { UserRole } from '@/types/pro-auth';
import DashboardButton from '@/components/dashboard/DashboardButton';
import { AuthService } from '@/services/pro-api';
import { FaBuilding, FaUserTie, FaHardHat } from 'react-icons/fa';

export default function ProLoginPage() {
    const router = useRouter();

    const [role, setRole] = useState<UserRole>('Agent');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await AuthService.login({ email, password });
            const payload = response.data || response;
            const userObj = payload.user || payload;
            const token = payload.token || userObj.token;

            if (!token) {
                console.warn("Login successful but NO TOKEN found in response:", payload);
            }

            const userData = {
                ...userObj,
                role: userObj.role || role,
                token: token
            };

            localStorage.setItem('user', JSON.stringify(userData));
            window.dispatchEvent(new Event('storage'));
            router.push('/dashboard');

        } catch (err: any) {
            console.error("Login Error:", err);
            const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-inda-light">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-inda-gray">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-inda-dark mb-2">Inda Pro</h1>
                    <p className="text-gray-500">Professional Access Portal</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100 text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">

                    <div>
                        <label className="block text-sm font-semibold text-inda-dark mb-3">Select Account Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'Agent', icon: FaUserTie, label: 'Agent' },
                                { id: 'Developer', icon: FaHardHat, label: 'Dev' },
                                { id: 'Investor', icon: FaBuilding, label: 'Invest' }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setRole(type.id as UserRole)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 ${role === type.id
                                            ? 'border-inda-teal bg-inda-teal/10 text-inda-teal shadow-sm'
                                            : 'border-gray-200 text-gray-400 hover:border-inda-teal/50 hover:bg-gray-50'
                                        }`}
                                >
                                    <type.icon className="text-xl mb-2" />
                                    <span className="text-xs font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-inda-dark mb-1">Email</label>
                            <input
                                required
                                type="email"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-inda-teal focus:border-inda-teal outline-none transition-all"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-inda-dark mb-1">Password</label>
                            <input
                                required
                                type="password"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-inda-teal focus:border-inda-teal outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <DashboardButton
                        type="submit"
                        variant="primary"
                        className="w-full py-3 text-lg shadow-md hover:shadow-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </DashboardButton>
                </form>
            </div>
        </div>
    );
}
