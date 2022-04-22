const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  const data = event.data;
  let sign_date1 = data.currentDate;
  return await db.collection('sign_record').where({
    sign_date: sign_date1
  }).get();
};
