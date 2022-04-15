 function getFormatDate(date) {
    var date = date;
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
 }
 function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
  }
module.exports = {
    getFormatDate: getFormatDate,
    trim: trim
 }