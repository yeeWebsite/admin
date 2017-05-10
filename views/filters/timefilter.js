/**
 * [timefilter 时间过滤器]
 * @param  {[type]} timestamp  [时间戳 单位：默认毫秒]
 * @param  {[type]} timeformat [返回时间格式]
 * @return {[type]}            [description]
 */
export function timefilter (timestamp, timeformat = 'yyyy/mm/dd hh:ii:ss') {
  let timestr;
  const t = new Date(timestamp);
  timestr = timeformat;
  timestr = timestr.replace(/yyyy/i, t.getFullYear());
  timestr = timestr.replace(/mm/i, t.getMonth()+1>9?t.getMonth()+1:'0'+(t.getMonth()+1));
  timestr = timestr.replace(/dd/i, t.getDate()>9?t.getDate().toString():'0'+t.getDate());
  timestr = timestr.replace(/hh/i, t.getHours()>9?t.getHours().toString():'0'+t.getHours()); 
  timestr = timestr.replace(/ii/i, t.getMinutes()>9?t.getMinutes().toString():'0'+t.getMinutes()); 
  timestr = timestr.replace(/ss/i, t.getSeconds()>9?t.getSeconds().toString():'0'+t.getSeconds());
  return timestr;
}
