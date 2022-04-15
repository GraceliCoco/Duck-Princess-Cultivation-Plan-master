const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const data = event.data;
  // 返回数据库查询结果
  let sign_date1 = data.currentDate ? data.currentDate : new Date("yyyy-MM-dd");
  console.log(data, 'data in add sign record', sign_date1);
  return await db.collection('sign_record').add({
    data: [{
      sign_date: sign_date1,
      is_sign: true,
      operate_time: new Date(),
    }]
  });
};
