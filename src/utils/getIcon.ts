import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

/**
 * Utility to safely get a Lucide icon by name.
 * @param iconName Name of the icon (camelCase, PascalCase, or kebab-case)
 * @param fallback Fallback icon if not found
 * @returns LucideIcon component
 */
export const getIcon = (iconName: string, fallback: LucideIcon = Icons.Briefcase): LucideIcon => {
  if (!iconName) return fallback;
  
  // Try direct match (e.g., LayoutTemplate)
  if ((Icons as any)[iconName]) return (Icons as any)[iconName];
  
  // Try capitalization (e.g., layoutTemplate -> LayoutTemplate)
  const capitalized = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  if ((Icons as any)[capitalized]) return (Icons as any)[capitalized];
  
  // Try PascalCase transformation (e.g., layout-template -> LayoutTemplate)
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  if ((Icons as any)[pascalCase]) return (Icons as any)[pascalCase];
  
  return fallback;
};
