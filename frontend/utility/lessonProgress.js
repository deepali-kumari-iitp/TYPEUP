const STORAGE_KEY = 'typeup_completed_lessons'
const LEGACY_KEY = 'typeup_completed_days'

export function getCompletedLessons() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    // Migrate previously saved day numbers, if present.
    const legacy = saved === null
      ? localStorage.getItem(LEGACY_KEY)
      : null

    const parsed = JSON.parse(saved ?? legacy ?? '[]')

    if (!Array.isArray(parsed)) return []

    return [...new Set(
      parsed
        .map(Number)
        .filter(day => Number.isInteger(day) && day >= 1 && day <= 30)
    )].sort((a, b) => a - b)
  } catch {
    return []
  }
}

export function completeLesson(dayNumber) {
  if (
    !Number.isInteger(dayNumber) ||
    dayNumber < 1 ||
    dayNumber > 30
  ) {
    throw new Error('Invalid lesson number.')
  }

  const completed = getCompletedLessons()

  if (!completed.includes(dayNumber)) {
    completed.push(dayNumber)
    completed.sort((a, b) => a - b)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  localStorage.removeItem(LEGACY_KEY)

  window.dispatchEvent(new Event('lesson-progress-updated'))

  return completed
}