import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { LayoutDashboard, ScanLine, Paintbrush, TrendingUp, Bell } from 'lucide-react-native';
import { Header } from '../../src/components/Header';
import { TabIcon } from '../../src/components/TabIcon';
import { colors } from '../../src/design-system/colors';

export default function TabLayout() {
  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.rootEarth,
          tabBarInactiveTintColor: colors.rootEarth,
          tabBarStyle: {
            backgroundColor: colors.parchment,
            borderTopColor: colors.warmStone + '33',
            height: Platform.OS === 'web' ? 64 : 80,
            paddingBottom: Platform.OS === 'web' ? 8 : 24,
          },
          tabBarLabelStyle: {
            fontFamily: 'GeistSans',
            fontSize: 11,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <TabIcon Icon={LayoutDashboard} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Scanner',
            tabBarIcon: ({ focused }) => <TabIcon Icon={ScanLine} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="render"
          options={{
            title: 'Render',
            tabBarIcon: ({ focused }) => <TabIcon Icon={Paintbrush} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="prospector"
          options={{
            title: 'Deals',
            tabBarIcon: ({ focused }) => <TabIcon Icon={TrendingUp} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: 'Alerts',
            tabBarIcon: ({ focused }) => <TabIcon Icon={Bell} focused={focused} />,
          }}
        />
      </Tabs>
    </>
  );
}
