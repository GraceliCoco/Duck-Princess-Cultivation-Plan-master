const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const data = event.data
  // 返回数据库查询结果
  return await db.collection('sign_record').add({
    data: [{
      sign_date: data.currentDate,
      is_sign: true,
      operate_time: new Date(),
    }]
  });
};
