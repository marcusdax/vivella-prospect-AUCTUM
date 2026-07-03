import React from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScannerHits } from '../../src/hooks/useScannerHits';
import { useRenderJobs } from '../../src/hooks/useRenderJobs';
import { useProspects } from '../../src/hooks/useProspects';
import { usePortfolio } from '../../src/hooks/usePortfolio';
import { useAlerts } from '../../src/hooks/useAlerts';
import type { RenderJob } from '../../src/services/renderer/types';
import { Card } from '../../src/components/Card';
import { KPIStat } from '../../src/components/KPIStat';
import { QuickActionCard } from '../../src/components/QuickActionCard';
import { Button } from '../../src/components/Button';
import { colors } from '../../src/design-system/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const scanner = useScannerHits();
  const renders = useRenderJobs();
  const prospects = useProspects();
  const portfolio = usePortfolio();
  const alerts = useAlerts();

  const completedRenders = (renders.data ?? []).filter((j: RenderJob) => j.status === 'completed').length;
  const unreadAlerts = alerts.alerts.filter((a) => !a.read).length;

  const isLoading = scanner.isLoading || renders.isLoading || prospects.isLoading;

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-8">
        <Text className="text-3xl font-sans font-medium text-root-earth tracking-tight">
          Property Intelligence
        </Text>
        <Text className="text-base text-deep-bark font-sans mt-1">
          Your command center for distressed assets and renovation opportunities.
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.neuralAmber} className="mt-8" />
        ) : (
          <>
            <Card className="mt-6 flex-row flex-wrap gap-4">
              <KPIStat value={`${scanner.data?.length ?? 0}`} label="Scanner hits" />
              <KPIStat value={`${completedRenders}`} label="Rendered" />
              <KPIStat value={`${prospects.data?.length ?? 0}`} label="Prospects" />
              <KPIStat value={`${portfolio.items.length}`} label="Tracked" />
            </Card>

            <Text className="text-xl font-sans font-medium text-root-earth mt-8 mb-3">
              Quick actions
            </Text>
            <QuickActionCard
              title="Sentinel Scanner"
              subtitle="Review flagged property conditions"
              count={scanner.data?.length}
              onPress={() => router.push('/scanner')}
            />
            <QuickActionCard
              title="Alter Rendering"
              subtitle="Generate renovation visualizations"
              count={renders.data?.length}
              onPress={() => router.push('/render')}
            />
            <QuickActionCard
              title="Real Estate Prospector"
              subtitle="Find off-market investment opportunities"
              count={prospects.data?.length}
              onPress={() => router.push('/prospector')}
            />
            <QuickActionCard
              title="Alerts"
              subtitle={`${unreadAlerts} unread`}
              onPress={() => router.push('/alerts')}
            />

            <Button
              title="Open Settings"
              onPress={() => router.push('/settings' as any)}
              variant="ghost"
              className="mt-4"
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
