/**
 * Date formatting utilities
 */

/**
 * Format date to "1 Jan 2025" format
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Formatted date string or '-' if invalid
 */
export const formatDate = (dateInput?: string | Date | number): string => {
  if (!dateInput) return '-'
  
  try {
    const date = new Date(dateInput)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-'
    }
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch (error) {
    console.warn('Invalid date format:', dateInput)
    return '-'
  }
}

/**
 * Format date to "1 Januari 2025" format (full month name)
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Formatted date string or '-' if invalid
 */
export const formatDateLong = (dateInput?: string | Date | number): string => {
  if (!dateInput) return '-'
  
  try {
    const date = new Date(dateInput)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-'
    }
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    console.warn('Invalid date format:', dateInput)
    return '-'
  }
}

/**
 * Format date to "1 Jan 2025, 14:30" format (with time)
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Formatted date string with time or '-' if invalid
 */
export const formatDateTime = (dateInput?: string | Date | number): string => {
  if (!dateInput) return '-'
  
  try {
    const date = new Date(dateInput)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-'
    }
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.warn('Invalid date format:', dateInput)
    return '-'
  }
}

/**
 * Format date to ISO string for form inputs (YYYY-MM-DD)
 * @param dateInput - Date string, Date object, or timestamp
 * @returns ISO date string or empty string if invalid
 */
export const formatDateForInput = (dateInput?: string | Date | number): string => {
  if (!dateInput) return ''
  
  try {
    const date = new Date(dateInput)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''
    }
    
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.warn('Invalid date format:', dateInput)
    return ''
  }
}

/**
 * Calculate age from birth date
 * @param birthDate - Birth date string, Date object, or timestamp
 * @returns Age in years or null if invalid
 */
export const calculateAge = (birthDate?: string | Date | number): number | null => {
  if (!birthDate) return null
  
  try {
    const birth = new Date(birthDate)
    const today = new Date()
    
    // Check if birth date is valid
    if (isNaN(birth.getTime())) {
      return null
    }
    
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age >= 0 ? age : null
  } catch (error) {
    console.warn('Invalid birth date:', birthDate)
    return null
  }
}

/**
 * Get relative time (e.g., "2 hari yang lalu", "3 minggu yang lalu")
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Relative time string or '-' if invalid
 */
export const getRelativeTime = (dateInput?: string | Date | number): string => {
  if (!dateInput) return '-'
  
  try {
    const date = new Date(dateInput)
    const now = new Date()
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-'
    }
    
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)
    
    if (diffYears > 0) {
      return `${diffYears} tahun yang lalu`
    } else if (diffMonths > 0) {
      return `${diffMonths} bulan yang lalu`
    } else if (diffWeeks > 0) {
      return `${diffWeeks} minggu yang lalu`
    } else if (diffDays > 0) {
      return `${diffDays} hari yang lalu`
    } else {
      return 'Hari ini'
    }
  } catch (error) {
    console.warn('Invalid date format:', dateInput)
    return '-'
  }
}

/**
 * Check if date is today
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Boolean indicating if date is today
 */
export const isToday = (dateInput?: string | Date | number): boolean => {
  if (!dateInput) return false
  
  try {
    const date = new Date(dateInput)
    const today = new Date()
    
    return date.toDateString() === today.toDateString()
  } catch (error) {
    return false
  }
}

/**
 * Check if date is valid
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Boolean indicating if date is valid
 */
export const isValidDate = (dateInput?: string | Date | number): boolean => {
  if (!dateInput) return false
  
  try {
    const date = new Date(dateInput)
    return !isNaN(date.getTime())
  } catch (error) {
    return false
  }
}
