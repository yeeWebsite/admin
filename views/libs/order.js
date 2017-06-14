export function getOrderStatus(status){
  const statusJson = { 
  	"0":"初始",
  	"1":"未付款",
  	"2":"已付款",
  	"3":"配送中",
  	"4":"配送完成",
  	"5":"就餐中",
	  "6":"申请打包",
    "90":"已打包",
  	"100":"订单完成",
  	"-100":"逾期",
  	"-200":"退款中",
  	"-300":"退款完成",
  	"-400":"逾期未就餐",
  	"-110":"退款待审核",
  	"-120":"退款审核通过",
  	"-130":"退款审核不通过",
    "-200":"退款中",
    "-300":"退款完成",
    "-900":"逾期关闭",
    "-1000":"已关闭"
  }
  if(typeof status != 'undefined' && statusJson[status]) return statusJson[status];
  else return '-';
}