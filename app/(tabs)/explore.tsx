import { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import {
  CATEGORY_LABELS,
  COLOR_DATA,
  ColorEntry,
  isLightColor,
} from '@/constants/ColorData';

type Category = ColorEntry['category'] | 'all';

const CATEGORIES: Category[] = ['all', 'warm', 'cool', 'nature', 'neutral', 'pastel'];
const CATEGORY_ALL_LABEL = '🌈 Todos';

export default function ExploreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selected, setSelected] = useState<ColorEntry | null>(null);

  const bg = isDark ? '#0f0f0f' : '#f5f5f5';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const textPrimary = isDark ? '#f0f0f0' : '#1a1a1a';
  const textSecondary = isDark ? '#aaaaaa' : '#666666';
  const borderColor = isDark ? '#333' : '#e0e0e0';
  const chipBg = isDark ? '#2a2a2a' : '#ececec';

  const filtered =
    activeCategory === 'all'
      ? COLOR_DATA
      : COLOR_DATA.filter((c) => c.category === activeCategory);

  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderBottomColor: borderColor }]}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>🎨 Paleta de Colores</Text>
        <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
          {filtered.length} colores
        </Text>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}>
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          const label = cat === 'all' ? CATEGORY_ALL_LABEL : CATEGORY_LABELS[cat];
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.chip,
                { backgroundColor: isActive ? textPrimary : chipBg },
              ]}>
              <Text style={[styles.chipText, { color: isActive ? bg : textSecondary }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Color grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.hex + item.name}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const textCol = isLightColor(item.hex) ? '#1a1a1a' : '#ffffff';
          return (
            <Pressable
              style={[styles.colorCard, { backgroundColor: cardBg, borderColor }]}
              onPress={() => setSelected(item)}>
              <View style={[styles.colorSwatch, { backgroundColor: item.hex }]}>
                <Text style={[styles.swatchHex, { color: textCol }]}>{item.hex}</Text>
              </View>
              <Text style={[styles.colorName, { color: textPrimary }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.colorCat, { color: textSecondary }]}>
                {CATEGORY_LABELS[item.category]}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* Detail modal */}
      {selected && (
        <Pressable style={styles.overlay} onPress={() => setSelected(null)}>
          <Pressable style={[styles.detailCard, { backgroundColor: cardBg, borderColor }]}>
            <View style={[styles.detailSwatch, { backgroundColor: selected.hex }]} />
            <Text style={[styles.detailName, { color: textPrimary }]}>{selected.name}</Text>
            <Text style={[styles.detailHex, { color: textSecondary }]}>{selected.hex}</Text>
            <Text style={[styles.detailCategory, { color: textSecondary }]}>
              {CATEGORY_LABELS[selected.category]}
            </Text>
            <Pressable
              style={[styles.closeBtn, { borderColor }]}
              onPress={() => setSelected(null)}>
              <Text style={[styles.closeBtnText, { color: textPrimary }]}>Cerrar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  chipRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    padding: 12,
    paddingBottom: 40,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  colorCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  colorSwatch: {
    height: 100,
    justifyContent: 'flex-end',
    padding: 8,
  },
  swatchHex: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'SpaceMono',
  },
  colorName: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  colorCat: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCard: {
    width: 300,
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  detailSwatch: {
    height: 200,
  },
  detailName: {
    fontSize: 22,
    fontWeight: '800',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  detailHex: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  detailCategory: {
    fontSize: 14,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 20,
  },
  closeBtn: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
