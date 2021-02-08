import moment from "moment";

function formatDate(data: string): string {
  return moment(data).format('YYYY-MM-DD')
}

function formatNumber(data: number): string {
  if (data < 0) {
    return data.toString()
  } else if (data > 0) {
    return '+' + data
  } else {
    return ''
  }
}

function formatContent(data: string | null): string {
  if (data === null) {
    return '暂时未找到新闻内容'
  } else {
    return data.slice(3, 20)
  }
}

export {formatDate, formatNumber, formatContent}
