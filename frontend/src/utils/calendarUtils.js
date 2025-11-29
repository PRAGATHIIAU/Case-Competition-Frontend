/**
 * Google Calendar Link Generator
 * 
 * Generates a URL that opens Google Calendar with pre-filled event details
 * 
 * @param {string} title - Event title
 * @param {string} description - Event description
 * @param {Date|string} startTime - Start date/time
 * @param {number} durationMinutes - Duration in minutes (default: 60)
 * @param {string} location - Location (optional, e.g., Zoom link)
 * @returns {string} - Google Calendar URL
 */
export function generateGoogleCalendarLink(
  title,
  description,
  startTime,
  durationMinutes = 60,
  location = ''
) {
  // Convert startTime to Date if it's a string
  const start = new Date(startTime)
  
  // Calculate end time
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)
  
  // Format dates to YYYYMMDDTHHmmssZ (Google Calendar format)
  const formatDate = (date) => {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
  }
  
  const startDateStr = formatDate(start)
  const endDateStr = formatDate(end)
  
  // Build Google Calendar URL
  const baseUrl = 'https://calendar.google.com/calendar/render'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDateStr}/${endDateStr}`,
    details: description,
    location: location,
    sf: 'true', // Show form
    output: 'xml' // Output format
  })
  
  const calendarUrl = `${baseUrl}?${params.toString()}`
  
  console.log('📅 Generated Google Calendar Link:')
  console.log('  ├─ Title:', title)
  console.log('  ├─ Start:', start.toISOString())
  console.log('  ├─ End:', end.toISOString())
  console.log('  └─ URL:', calendarUrl)
  
  return calendarUrl
}

/**
 * Format date/time for display
 * 
 * @param {Date|string} dateTime - Date/time to format
 * @returns {string} - Formatted date/time string
 */
export function formatDateTime(dateTime) {
  const date = new Date(dateTime)
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

