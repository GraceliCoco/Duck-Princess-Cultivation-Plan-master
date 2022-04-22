const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const data = event.data
  // 返回数据库查询结果
  return await db.collection('mission').add({
    data: [{
      mission_content: data.mission_content,
      mission_integral: Number(data.mission_integral),
      mission_image: data.mission_image,
      is_online: data.is_online,
      is_finished: data.is_finished,
      is_need_reset: Boolean(data.is_need_reset),
      is_display: data.is_display,
    }],
    success(res){
      // console.log(res, data, '1111111111')
    }
  });
};
