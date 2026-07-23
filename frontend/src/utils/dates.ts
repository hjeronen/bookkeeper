const monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' })
const dayFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const getMonthName = (month: number) =>
  monthFormatter.format(new Date(2000, month - 1, 1))

export const formatDay = (date: string) =>
  dayFormatter.format(new Date(`${date}T12:00:00`))
