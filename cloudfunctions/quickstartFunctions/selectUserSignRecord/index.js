const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  const data = event.data;
  console.log('zhixing 1111111111')
  console.log(event, 111111111111)
  console.log(data, 'data12345');
  return await db.collection('sign_record').where({
    sign_date: new Date('yyyy-MM-dd')
  }).get();
};
