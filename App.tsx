import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ServiceBookingCard } from './src/components/ServiceBookingCard';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.tag}>URBANFIX HOME SERVICES</Text>
          <Text style={styles.title}>Book Expert Technicians</Text>
          <Text style={styles.subtitle}>Verified professionals, transparent upfront pricing & 30-day warranty</Text>
        </View>

        <ServiceBookingCard
          serviceTitle="Inverter AC Deep Jet Cleaning & Gas Check"
          categoryName="Appliance Repair & Servicing"
          technicianName="Vikram Sharma (Urban Verified)"
          rating={4.88}
        />

        <ServiceBookingCard
          serviceTitle="Water Purifier Filter & Membrane Replacement"
          categoryName="Plumbing & Water Systems"
          technicianName="Rajesh Verma (5-Star Rated)"
          rating={4.94}
          inputs={{
            baseLaborPaise: 39900,
            partsCostPaise: 85000,
            discountVoucherPaise: 15000,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.base,
  },
  header: {
    marginVertical: spacing.lg,
  },
  tag: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
