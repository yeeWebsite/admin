export function getOrderStatus(status){
  const statusJson = { 
  	"0":"初始",
  	"1":"未付款",
  	"2":"已付款",
  	"3":"配送中",
  	"4":"配送完成",
  	"5":"用餐中",
  	"100":"已完成",
  	"-100":"逾期",
  	"-200":"退款中",
  	"-300":"已退款",
  	"-400":"已取消"
  }
  if(typeof status != 'undefined' && statusJson[status]) return statusJson[status];
  else return statusJson;
}