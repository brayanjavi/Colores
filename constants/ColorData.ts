export type ColorEntry = {
  name: string;
  hex: string;
  category: 'warm' | 'cool' | 'neutral' | 'nature' | 'pastel';
};

export const COLOR_DATA: ColorEntry[] = [
  // Warm
  { name: 'Rojo Carmesí', hex: '#DC143C', category: 'warm' },
  { name: 'Naranja Fuego', hex: '#FF4500', category: 'warm' },
  { name: 'Amarillo Dorado', hex: '#FFD700', category: 'warm' },
  { name: 'Coral', hex: '#FF6B6B', category: 'warm' },
  { name: 'Tomate', hex: '#FF6347', category: 'warm' },
  { name: 'Salmón', hex: '#FA8072', category: 'warm' },
  { name: 'Magenta', hex: '#FF00FF', category: 'warm' },
  { name: 'Rosa Fucsia', hex: '#FF1493', category: 'warm' },
  // Cool
  { name: 'Azul Marino', hex: '#003153', category: 'cool' },
  { name: 'Azul Cobalto', hex: '#0047AB', category: 'cool' },
  { name: 'Índigo', hex: '#4B0082', category: 'cool' },
  { name: 'Violeta', hex: '#8B00FF', category: 'cool' },
  { name: 'Cian', hex: '#00BCD4', category: 'cool' },
  { name: 'Azul Zafiro', hex: '#0F52BA', category: 'cool' },
  { name: 'Púrpura', hex: '#800080', category: 'cool' },
  { name: 'Lavanda', hex: '#967BB6', category: 'cool' },
  // Nature
  { name: 'Verde Esmeralda', hex: '#50C878', category: 'nature' },
  { name: 'Verde Oliva', hex: '#808000', category: 'nature' },
  { name: 'Verde Lima', hex: '#32CD32', category: 'nature' },
  { name: 'Verde Bosque', hex: '#228B22', category: 'nature' },
  { name: 'Turquesa', hex: '#40E0D0', category: 'nature' },
  { name: 'Marrón Tierra', hex: '#8B4513', category: 'nature' },
  { name: 'Ocre', hex: '#CC7722', category: 'nature' },
  { name: 'Musgo', hex: '#8A9A5B', category: 'nature' },
  // Neutral
  { name: 'Gris Pizarra', hex: '#708090', category: 'neutral' },
  { name: 'Negro Carbón', hex: '#333333', category: 'neutral' },
  { name: 'Blanco Hueso', hex: '#F5F5DC', category: 'neutral' },
  { name: 'Plata', hex: '#C0C0C0', category: 'neutral' },
  { name: 'Bronce', hex: '#CD7F32', category: 'neutral' },
  { name: 'Cobre', hex: '#B87333', category: 'neutral' },
  // Pastel
  { name: 'Rosa Pastel', hex: '#FFB3BA', category: 'pastel' },
  { name: 'Melocotón', hex: '#FFDFBA', category: 'pastel' },
  { name: 'Amarillo Pastel', hex: '#FFFFBA', category: 'pastel' },
  { name: 'Menta', hex: '#BAFFC9', category: 'pastel' },
  { name: 'Cielo Pastel', hex: '#BAE1FF', category: 'pastel' },
  { name: 'Lila Pastel', hex: '#E8BAFF', category: 'pastel' },
];

export const CATEGORY_LABELS: Record<ColorEntry['category'], string> = {
  warm: '🔥 Cálidos',
  cool: '❄️ Fríos',
  nature: '🌿 Naturaleza',
  neutral: '⚪ Neutros',
  pastel: '🌸 Pasteles',
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getRandomColors(count: number, exclude?: string): ColorEntry[] {
  const pool = exclude ? COLOR_DATA.filter((c) => c.name !== exclude) : [...COLOR_DATA];
  return shuffle(pool).slice(0, count);
}

export function getRandomColor(): ColorEntry {
  return COLOR_DATA[Math.floor(Math.random() * COLOR_DATA.length)];
}

export function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}
