import { useAuth } from '@/contexts/AuthContext';
import AppSidebar from './AppSidebar';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import notificationsApi, { NotificationItem } from '@/api/notifications';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    showHeader?: boolean;
}

export default function DashboardLayout({ children, showHeader = true }: DashboardLayoutProps) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    useEffect(() => {
        if (isAuthenticated && user) {
            const allowedRoles = ['AGENT', 'DEVELOPER', 'ADMIN', 'SUPER_ADMIN'];
            if (!allowedRoles.includes(user.role)) {
                router.replace('/');
            }
        }
    }, [user, isAuthenticated, router]);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setNotifications([]);
            setNotificationCount(0);
            return;
        }

        let eventSource: EventSource | null = null;

        const loadNotifications = async () => {
            try {
                const [items, count] = await Promise.all([
                    notificationsApi.list(10),
                    notificationsApi.unreadCount(),
                ]);
                setNotifications(items);
                setNotificationCount(count);
            } catch (error) {
                console.error('Failed to load notifications:', error);
            }
        };

        const streamUrl = notificationsApi.getStreamUrl();
        if (streamUrl) {
            eventSource = new EventSource(streamUrl);

            eventSource.addEventListener('notification', (event) => {
                try {
                    const notification = JSON.parse((event as MessageEvent).data) as NotificationItem;
                    setNotifications((current) => [notification, ...current.filter((item) => item.id !== notification.id)].slice(0, 10));
                } catch (error) {
                    console.error('Failed to parse notification event:', error);
                }
            });

            eventSource.addEventListener('unread_count', (event) => {
                try {
                    const payload = JSON.parse((event as MessageEvent).data) as { count: number };
                    setNotificationCount(payload.count);
                } catch (error) {
                    console.error('Failed to parse unread count event:', error);
                }
            });

            eventSource.onerror = () => {
                eventSource?.close();
            };
        }

        void loadNotifications();

        return () => {
            eventSource?.close();
        };
    }, [isAuthenticated, user]);

    const getInitials = () => {
        if (!user) return 'U';
        const first = user.firstName?.[0] || '';
        const last = user.lastName?.[0] || '';
        return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
    };

    const handleNotificationClick = async (notification: NotificationItem) => {
        try {
            if (!notification.readAt) {
                await notificationsApi.markAsRead(notification.id);
                setNotifications((current) =>
                    current.map((item) =>
                        item.id === notification.id ? { ...item, readAt: new Date().toISOString() } : item,
                    ),
                );
                setNotificationCount((current) => Math.max(0, current - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        } finally {
            setShowNotifications(false);
            if (notification.link) {
                void router.push(notification.link);
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            setNotifications((current) =>
                current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })),
            );
            setNotificationCount(0);
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
    };

    const formatNotificationTime = (dateString: string) =>
        new Date(dateString).toLocaleString('en-NG', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* Full-width top header */}
            {showHeader && (
                <header className="bg-white h-16 fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#4ea8a1] rounded-lg px-3 py-2 flex items-center justify-center">
                            <span className="text-white font-bold text-base">I</span>
                        </div>
                        <span className="text-gray-900 font-bold text-lg">Inda Pro</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button
                                className="relative group"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#4ea8a1] rounded-full text-white text-xs flex items-center justify-center font-semibold">
                                        {notificationCount > 9 ? '9+' : notificationCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-[360px] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                            <p className="text-xs text-gray-500">{notificationCount} unread</p>
                                        </div>
                                        <button
                                            onClick={handleMarkAllAsRead}
                                            className="text-xs font-medium text-[#4ea8a1] hover:text-[#3d8780]"
                                        >
                                            Mark all read
                                        </button>
                                    </div>

                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                                            No notifications yet
                                        </div>
                                    ) : (
                                        <div className="max-h-[420px] overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <button
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${!notification.readAt ? 'bg-[#f5fbfa]' : 'bg-white'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                                                            <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                                                            <div className="text-xs text-gray-400 mt-2">{formatNotificationTime(notification.createdAt)}</div>
                                                        </div>
                                                        {!notification.readAt && (
                                                            <span className="w-2.5 h-2.5 rounded-full bg-[#4ea8a1] mt-1 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button className="bg-[#4ea8a1] rounded-full w-9 h-9 flex items-center justify-center overflow-hidden">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={`${user.firstName || user.email}'s avatar`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white font-semibold text-base">{getInitials()}</span>
                            )}
                        </button>
                    </div>
                </header>
            )}

            <AppSidebar headerVisible={showHeader} />

            <div className={`ml-[277px] ${showHeader ? 'pt-16' : ''}`}>
                <main className="p-8 pb-20 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
