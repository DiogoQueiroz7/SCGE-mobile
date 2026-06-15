import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visão Geral</Text>
        <Text style={styles.headerSubtitle}>Acompanhe os dados do seu inventário</Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>Total de Produtos</Text>
          <Text style={styles.cardValue}>1.240</Text>
          <Text style={styles.cardTrendPositive}>+12% na semana</Text>
        </View>
        <View style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>Movimentações</Text>
          <Text style={styles.cardValue}>34</Text>
          <Text style={styles.cardTrendNeutral}>Hoje</Text>
        </View>
      </View>

      <View style={[styles.card, styles.cardFull]}>
        <Text style={styles.cardLabel}>Itens com Estoque Baixo</Text>
        <Text style={[styles.cardValue, styles.alertValue]}>12</Text>
        <Text style={styles.cardSubText}>Requer atenção e reposição imediata</Text>
      </View>

      <Text style={styles.sectionTitle}>Atividades Recentes</Text>
      <View style={styles.activityCard}>
        <View style={styles.activityItem}>
          <View style={styles.activityDotSuccess} />
          <View style={styles.activityTextContainer}>
            <Text style={styles.activityTitle}>Entrada de Estoque</Text>
            <Text style={styles.activityDescription}>50 un. de Monitor Dell 27"</Text>
            <Text style={styles.activityTime}>Há 10 minutos</Text>
          </View>
        </View>
        <View style={styles.activityDivider} />
        <View style={styles.activityItem}>
          <View style={styles.activityDotWarning} />
          <View style={styles.activityTextContainer}>
            <Text style={styles.activityTitle}>Ajuste de Inventário</Text>
            <Text style={styles.activityDescription}>Teclado Mecânico Keychron</Text>
            <Text style={styles.activityTime}>Há 2 horas</Text>
          </View>
        </View>
        <View style={styles.activityDivider} />
        <View style={styles.activityItem}>
          <View style={styles.activityDotError} />
          <View style={styles.activityTextContainer}>
            <Text style={styles.activityTitle}>Alerta de Sistema</Text>
            <Text style={styles.activityDescription}>Falha na sincronização de dados</Text>
            <Text style={styles.activityTime}>Ontem, 14:30</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHalf: { width: '48%' },
  cardFull: { width: '100%', marginBottom: 28 },
  cardLabel: { fontSize: 13, color: '#6B7280', marginBottom: 8, fontWeight: '600', textTransform: 'uppercase' },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#111827' },
  alertValue: { color: '#EF4444' },
  cardTrendPositive: { fontSize: 12, color: '#10B981', marginTop: 4, fontWeight: '500' },
  cardTrendNeutral: { fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  cardSubText: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 12 },
  activityCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  activityItem: { flexDirection: 'row', alignItems: 'flex-start' },
  activityDotSuccess: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', marginRight: 12, marginTop: 5 },
  activityDotWarning: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#F59E0B', marginRight: 12, marginTop: 5 },
  activityDotError: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', marginRight: 12, marginTop: 5 },
  activityTextContainer: { flex: 1 },
  activityTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  activityDescription: { fontSize: 14, color: '#4B5563', marginTop: 2 },
  activityTime: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  activityDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
});