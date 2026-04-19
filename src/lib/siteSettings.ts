import { prisma } from '@/lib/prisma'
import { SETTING_KEYS, type SettingKey } from '@/lib/resumeSchemas'

export type SettingsMap = Partial<Record<SettingKey, string>>

const DEFAULTS: SettingsMap = {
  'hero.headline': 'Suleyman Kiani',
  'hero.subtitle': 'Full-stack builder · Toronto, ON',
  'hero.currentlyWorking': '',
  'hero.ctaLabel': 'Get in touch',
  'hero.ctaHref': 'mailto:suleyman@skompxcel.com',
  'social.github': 'https://github.com/kianis4',
  'social.linkedin': 'https://www.linkedin.com/in/suleyman-kiani',
  'social.x': '',
  'social.instagram': '',
  'social.email': 'mailto:suleyman@skompxcel.com',
}

export async function getAllSettings(): Promise<SettingsMap> {
  const rows = await prisma.siteSetting.findMany()
  const map: SettingsMap = {}
  for (const row of rows) {
    if ((SETTING_KEYS as readonly string[]).includes(row.key)) {
      map[row.key as SettingKey] = row.value
    }
  }
  return { ...DEFAULTS, ...map }
}

export function getSetting(settings: SettingsMap, key: SettingKey): string {
  return settings[key] ?? DEFAULTS[key] ?? ''
}
