const digitsRE = /(\d{3})(?=\d)/g

//console.log(defcur);

const symbol = '￥';
/**
 * [currency 货币过滤器]
 * @param  {[type]} value    [货币金额]
 * @param  {[type]} decimals [小数位数]
 * @return {[type]}          [格式化货币金额：$1,000,000]
 */
export function currency(value, decimals = 2) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  var sign = value < 0 ? '-' : ''
  return sign + symbol + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}
