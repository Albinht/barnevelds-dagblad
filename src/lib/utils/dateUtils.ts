export function formatDateDutch(dateString: string | null | undefined): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''
    }
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/Amsterdam'
    }
    
    return date.toLocaleDateString('nl-NL', options)
  } catch {
    return ''
  }
}

export function formatDateTimeDutch(dateString: string | null | undefined): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''
    }
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Amsterdam'
    }
    
    return date.toLocaleDateString('nl-NL', options)
  } catch {
    return ''
  }
}

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''
    }
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInSeconds < 60) {
      return 'Zojuist'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minuut' : 'minuten'} geleden`
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'uur' : 'uur'} geleden`
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'dag' : 'dagen'} geleden`
    } else {
      return formatDateDutch(dateString)
    }
  } catch {
    return ''
  }
}