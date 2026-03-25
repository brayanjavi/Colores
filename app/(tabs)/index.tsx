import { useCallback, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { COLOR_DATA, ColorEntry, getRandomColor, getRandomColors, isLightColor } from '@/constants/ColorData';

const TOTAL_OPTIONS = 4;

function buildRound() {
  const correct = getRandomColor();
  const distractors = getRandomColors(TOTAL_OPTIONS - 1, correct.name);
  const arr = [correct, ...distractors];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return { correct, options: arr };
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(() => buildRound());
  const [selected, setSelected] = useState<ColorEntry | null>(null);
  const [shakeAnim] = useState(new Animated.Value(0));

  const { correct, options } = round;
  const answered = selected !== null;
  const isCorrect = selected?.name === correct.name;

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const handleSelect = useCallback(
    (option: ColorEntry) => {
      if (answered) return;
      setSelected(option);
      if (option.name === correct.name) {
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
        shake();
      }
    },
    [answered, correct.name, shake]
  );

  const handleNext = useCallback(() => {
    setSelected(null);
    setRound(buildRound());
  }, []);

  const handleReset = useCallback(() => {
    setScore(0);
    setStreak(0);
    setSelected(null);
    setRound(buildRound());
  }, []);

  const swatchTextColor = isLightColor(correct.hex) ? '#1a1a1a' : '#ffffff';
  const bg = isDark ? '#0f0f0f' : '#f5f5f5';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const textPrimary = isDark ? '#f0f0f0' : '#1a1a1a';
  const textSecondary = isDark ? '#aaaaaa' : '#666666';
  const borderColor = isDark ? '#333' : '#e0e0e0';

  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: correct.hex }]}>
        <Text style={[styles.headerTitle, { color: swatchTextColor }]}>🎨 Adivina el Color</Text>
        <View style={styles.headerStats}>
          <View style={[styles.statBadge, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
            <Text style={[styles.statText, { color: swatchTextColor }]}>⭐ {score}</Text>
          </View>
          {streak >= 2 && (
            <View style={[styles.statBadge, { backgroundColor: 'rgba(255,200,0,0.3)' }]}>
              <Text style={[styles.statText, { color: swatchTextColor }]}>🔥 {streak}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Color Swatch */}
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <View style={[styles.swatchCard, { backgroundColor: cardBg, borderColor }]}>
          <View style={[styles.swatch, { backgroundColor: correct.hex }]}>
            {answered && (
              <Text style={[styles.swatchReveal, { color: swatchTextColor }]}>
                {isCorrect ? '✓' : '✗'}
              </Text>
            )}
          </View>
          <Text style={[styles.hexLabel, { color: textSecondary }]}>
            {answered ? correct.hex : '¿Cuál es este color?'}
          </Text>
        </View>
      </Animated.View>

      {/* Options */}
      <View style={styles.optionsGrid}>
        {options.map((option) => {
          const isSelected = selected?.name === option.name;
          const isRight = option.name === correct.name;
          let borderCol = borderColor;
          let bgCol = cardBg;
          let labelCol = textPrimary;
          if (answered) {
            if (isRight) {
              borderCol = '#22c55e';
              bgCol = isDark ? '#052e16' : '#f0fdf4';
              labelCol = '#16a34a';
            } else if (isSelected) {
              borderCol = '#ef4444';
              bgCol = isDark ? '#2d0a0a' : '#fff1f2';
              labelCol = '#dc2626';
            }
          } else if (isSelected) {
            borderCol = correct.hex;
          }

          return (
            <Pressable
              key={option.name}
              style={({ pressed }) => [
                styles.optionBtn,
                { backgroundColor: bgCol, borderColor: borderCol },
                !answered && pressed && styles.optionPressed,
              ]}
              onPress={() => handleSelect(option)}
              disabled={answered}>
              <View style={[styles.optionDot, { backgroundColor: option.hex }]} />
              <Text style={[styles.optionText, { color: labelCol }]}>{option.name}</Text>
              {answered && isRight && <Text style={styles.optionIcon}>✓</Text>}
              {answered && isSelected && !isRight && <Text style={styles.optionIcon}>✗</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* Feedback */}
      {answered && (
        <View style={styles.feedbackRow}>
          <Text style={[styles.feedbackText, { color: isCorrect ? '#16a34a' : '#dc2626' }]}>
            {isCorrect
              ? streak >= 3
                ? `🔥 ¡${streak} seguidas! ¡Increíble!`
                : '¡Correcto! 🎉'
              : `Era "${correct.name}"`}
          </Text>
          <View style={styles.actionRow}>
            <Pressable style={[styles.nextBtn, { backgroundColor: correct.hex }]} onPress={handleNext}>
              <Text style={[styles.nextBtnText, { color: isLightColor(correct.hex) ? '#1a1a1a' : '#fff' }]}>
                Siguiente →
              </Text>
            </Pressable>
            <Pressable style={[styles.resetBtn, { borderColor }]} onPress={handleReset}>
              <Text style={[styles.resetBtnText, { color: textSecondary }]}>Reiniciar</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={[styles.colorCount, { color: textSecondary }]}>
        {COLOR_DATA.length} colores en el juego
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statText: {
    fontSize: 15,
    fontWeight: '700',
  },
  swatchCard: {
    margin: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  swatch: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchReveal: {
    fontSize: 64,
    fontWeight: '900',
  },
  hexLabel: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  optionsGrid: {
    paddingHorizontal: 20,
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
  },
  optionPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  optionDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  optionIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackRow: {
    marginTop: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  nextBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 30,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  resetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1.5,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  colorCount: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
  },
});
