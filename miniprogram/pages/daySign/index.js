// pages/daySign/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_date_log: ['2022-04-14','20222'],
        selected: [
            // {
            //   date: '2022-4-11'
            // }, {
            //   date: '2022-4-12'
            // },{
            //   date: '2022-4-13'
            // },{
            //   date: '2022-4-14'
            // }
          ],
        isOpen: true,
        signRecords: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    selectSignedData(){
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'selectSignedRecord',
        }
      }).then((resp) => {
        let res = [];
        let item = "";
        for(let i = 0; i< resp.result.data.length; i++) {
          item = resp.result.data[i];
          res.push({date: item.sign_date})
        }
        console.log(resp, res, '查出所有签到记录')
        this.setData({
          signRecords: resp.result.data,
          selected: res
        //  userIntegral: resp.result.data[0].user_integral,
        //  userName: resp.result.data[0].user_name
        })
      }).catch((e) => {
     });
    },
    /**
     * 日历是否被打开
     */
    bindselect(e) {
        console.log(e.detail.ischeck,'点击确定')
    },
    /**
    * 获取选择日期
    */
    bindgetdate(e) {
        let time = e.detail;
        console.log(time,'点击确定111')
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.selectSignedData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})