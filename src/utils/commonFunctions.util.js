export const getPastYears = (year=5) => {
    const PastYears = []
    const date = new Date();
    const currentYear = date.getFullYear();
    for (let i = 0; i < year; i++) {
      PastYears.push(currentYear - i)
    }
    return PastYears;
}

export const getMonth = [
  { label: 'January', value: 1 },
  { label: 'Feburary', value: 2 },
  { label: 'March', value: 3 },
  { label: 'Apirl', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
]