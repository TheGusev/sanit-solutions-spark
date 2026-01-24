/**
 * Маппинг строковых ключей на Lucide-иконки
 * Используется для замены эмодзи на современные SVG-иконки
 */

import React from 'react';
import { 
  Bug, 
  Mouse, 
  Home, 
  Building, 
  Building2,
  Warehouse, 
  UtensilsCrossed, 
  Hospital,
  Wind,
  ShoppingCart,
  Factory,
  Zap,
  CheckCircle,
  FileText,
  Shield,
  Phone,
  Coins,
  Target,
  RefreshCw,
  FlaskConical,
  Search,
  Dog,
  Skull,
  Construction,
  LucideIcon
} from 'lucide-react';

// Тип для ключей иконок
export type IconKey = 
  | 'virus' | 'bug' | 'mouse' | 'rat' | 'ant'
  | 'home' | 'house' | 'building' | 'office' | 'warehouse' | 'utensils' | 'restaurant' | 'hospital' | 'medical'
  | 'wind' | 'shopping-cart' | 'factory'
  | 'zap' | 'check-circle' | 'file-text' | 'shield' | 'phone' | 'coins' | 'target' | 'refresh' | 'flask' | 'search'
  | 'dog' | 'skull' | 'construction';

// Маппинг ключей на компоненты Lucide
export const iconMap: Record<IconKey, LucideIcon> = {
  // Вредители
  'virus': Bug,
  'bug': Bug,
  'mouse': Mouse,
  'rat': Mouse,
  'ant': Bug,
  
  // Объекты
  'home': Home,
  'house': Home,
  'building': Building2,
  'office': Building,
  'warehouse': Warehouse,
  'utensils': UtensilsCrossed,
  'restaurant': UtensilsCrossed,
  'hospital': Hospital,
  'medical': Hospital,
  
  // Другое
  'wind': Wind,
  'shopping-cart': ShoppingCart,
  'factory': Factory,
  'zap': Zap,
  'check-circle': CheckCircle,
  'file-text': FileText,
  'shield': Shield,
  'phone': Phone,
  'coins': Coins,
  'target': Target,
  'refresh': RefreshCw,
  'flask': FlaskConical,
  'search': Search,
  'dog': Dog,
  'skull': Skull,
  'construction': Construction,
};

// Компонент-обёртка для рендеринга иконки по ключу
interface IconFromKeyProps {
  iconKey: IconKey | string;
  className?: string;
  size?: number;
}

export const IconFromKey: React.FC<IconFromKeyProps> = ({ iconKey, className = 'w-6 h-6', size }) => {
  const IconComponent = iconMap[iconKey as IconKey];
  
  if (!IconComponent) {
    // Fallback — возвращаем Bug как дефолт
    return <Bug className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
};

// Маппинг эмодзи на ключи иконок (для миграции существующего кода)
export const emojiToIconKey: Record<string, IconKey> = {
  '🦠': 'virus',
  '🪳': 'bug',
  '🐀': 'rat',
  '🐭': 'mouse',
  '🐜': 'ant',
  '🪲': 'bug',
  '🦟': 'bug',
  '🪰': 'bug',
  '💨': 'wind',
  '🏠': 'home',
  '🏡': 'house',
  '🏢': 'building',
  '📦': 'warehouse',
  '🍽️': 'restaurant',
  '🛒': 'shopping-cart',
  '🏭': 'factory',
  '🏥': 'hospital',
  '⚡': 'zap',
  '✅': 'check-circle',
  '📋': 'file-text',
  '🛡️': 'shield',
  '📞': 'phone',
  '💰': 'coins',
  '🎯': 'target',
  '🔄': 'refresh',
  '🧪': 'flask',
  '🔍': 'search',
  '🐕': 'dog',
  '💀': 'skull',
  '🚧': 'construction',
};

// Хелпер для конвертации эмодзи в ключ
export function getIconKeyFromEmoji(emoji: string): IconKey {
  return emojiToIconKey[emoji] || 'bug';
}

export default iconMap;
