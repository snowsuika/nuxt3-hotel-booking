export const weekDateFormate = (date) => {
  const targetDate = new Date(date)
  const month = targetDate.getMonth() + 1
  const day = targetDate.getDate()
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][targetDate.getDay()]

  return `${month} 月 ${day} 日星期${weekday}`
}