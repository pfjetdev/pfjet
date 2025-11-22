/**
 * Jet Sharing Configuration
 *
 * Настройки для динамической генерации и управления рейсами
 */

export type JetSharingMode = 'hybrid' | 'static' | 'dynamic'

export const jetSharingConfig = {
  /**
   * Режим работы:
   * - 'hybrid': Комбинация статических (из БД) и динамически сгенерированных рейсов
   * - 'static': Только рейсы из базы данных
   * - 'dynamic': Только динамически сгенерированные рейсы (меняются каждый день)
   */
  mode: (process.env.NEXT_PUBLIC_JET_SHARING_MODE as JetSharingMode) || 'dynamic',

  /**
   * Количество рейсов для отображения
   */
  defaultLimit: 100,

  /**
   * Интервал ревалидации (в секундах)
   * - hybrid/dynamic: 3600 (1 час) - т.к. данные меняются
   * - static: 86400 (24 часа) - т.к. данные редко меняются
   */
  revalidate: process.env.NEXT_PUBLIC_JET_SHARING_MODE === 'static' ? 86400 : 3600,

  /**
   * Настройки для динамической генерации
   */
  dynamic: {
    // Количество динамически генерируемых рейсов
    count: 50,

    // Диапазон дат (дни вперед)
    daysAhead: 14,

    // Шанс того, что рейс будет featured (0-1)
    featuredChance: 0.15,
  },

  /**
   * Настройки для гибридного режима
   */
  hybrid: {
    // Доля статических рейсов (0-1)
    staticRatio: 0.3,

    // Доля динамических рейсов (0-1)
    dynamicRatio: 0.7,
  },

  /**
   * Автоматическое обновление статусов
   */
  autoUpdate: {
    // Включить автоматическое обновление статусов
    enabled: true,

    // Интервал проверки (в минутах)
    checkInterval: 60,
  },
}

/**
 * Get current mode
 */
export function getJetSharingMode(): JetSharingMode {
  return jetSharingConfig.mode
}

/**
 * Is dynamic mode enabled?
 */
export function isDynamicMode(): boolean {
  return jetSharingConfig.mode === 'dynamic' || jetSharingConfig.mode === 'hybrid'
}

/**
 * Is static mode enabled?
 */
export function isStaticMode(): boolean {
  return jetSharingConfig.mode === 'static' || jetSharingConfig.mode === 'hybrid'
}
