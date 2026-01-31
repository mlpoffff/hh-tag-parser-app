import * as xlsx from 'xlsx'

export function saveToExcel(data) {
  try {
    const dataArray = Object.entries(data).map(([Tag, Count]) => ({
      Tag,
      Count
    }))

    const formattedData = dataArray.map(item => ({
      'Тэг': item.Tag,
      'Кол-во повторений': item.Count
    }))

    const workbook = xlsx.utils.book_new()
    const worksheet = xlsx.utils.json_to_sheet(formattedData)

    worksheet['!cols'] = [
      { wch: 40 },
      { wch: 20 }
    ]

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Tags')
    xlsx.writeFile(workbook, 'Экспорт.xlsx')
  } catch (e) {
    console.error(e)
  }
}
