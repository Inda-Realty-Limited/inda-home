import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TrainingHub } from '@/components/training/TrainingHub';

export default function TrainingPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <TrainingHub />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
