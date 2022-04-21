// pages/daySign/index.js
const util = require('../../utils/util.js');
import regeneratorRuntime from '../../utils/runtime.js';
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
        isSignCanClick: true,


        curYear: new Date().getFullYear(), // 年份
        curMonth: new Date().getMonth()+1,// 月份 0-11
        day: new Date().getDate(), // 日期 1-31 若日期超过该月天数，月份自动增加
        header_show: true, // 主标题是否显示
        prev: true, // 上一个月按钮是否显示
        next: true, // 下一个月按钮是否显示
        isClick: false,
        // selectDate: util.getFormatDate(new Date())
        speciallist: [],
        mystatus: [],

        haveGetRecord: false,
        missionRecord: [],
        signMissionData: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.selectUserSignRecord();
      this.setData({
        speciallist: [
          { date: '2022-05-02', background: 'yellow',text:'文字1',color:'', textBgcolor: '#e19' },
          { date: '2022-04-20', background: 'red', text:'生日'  },
        ]
      });
      this.getMissionRecord();
      console.log(regeneratorRuntime)
    },

    nextMonth: function (e) {
      console.log(e)
      const currentYear = e.detail.currentYear;
      const currentMonth = e.detail.currentMonth;
      wx.showModal({
        title: '当前日期',
        content: '当前年份：' + currentYear + '年\n当前月份：' + currentMonth + '月'
      });
    },

    clickToSign(e){
      console.log(e, '点击今日签到')
      this.userSign();
    },

    selectDate(e){
      console.log(e, 'click select date')
    },
    nextMonth(e){

    },
    prevMonth(e){

    },
    chooseDate(e){
      console.log(e,点击了日期)
    },

    selectUserSignRecord(){
      console.log('执行selectUserSignRecord')
       wx.cloud.callFunction({
         name: 'quickstartFunctions',
         config: {
           env: this.data.envId
         },
         data: {
           type: 'selectUserSignRecord',
           data: {
             currentDate: util.getFormatDate(new Date()),
           }
         }
       }).then((resp) => {
         console.log(resp, '查完状态', new Date("yyyy-MM-dd"), util.getFormatDate(new Date()))
         this.setData({
          isSignCanClick: !resp.result.data[0].is_sign,
         })
       }).catch((e) => {
     });
    },
    // 
    async updateSignRecord(){
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'addSignRecord',
          data: {
            currentDate: util.getFormatDate(new Date()),
          }
        }
      }).then((resp) => {
        console.log(resp, '签到状态')
        this.updateUserIntegeral(this.data.signMissionData);
        this.setData({
          is_user_sign: true,
        });
        wx.showToast({
          title: '签到成功',
        });
        
      }).catch((e) => {

      });
    },
    async userSign(datas){
      await this.updateUserIntegeralAndSignMission();
    },
    async getMissionRecord() {
      wx.showLoading({
        title: '',
      });
     wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'selectMission'
        }
      }).then((resp) => {
        console.log(resp, '获取所有mission');
        this.setData({
          haveGetRecord: true,
          missionRecord: resp.result.data
        });
        wx.hideLoading();
     }).catch((e) => {
        console.log(e);
        this.setData({
          // showUploadTip: true
        });
       wx.hideLoading();
     });
    },
    async updateUserIntegeralAndSignMission(){
      if(this.data.missionRecord.length === 0 || !this.data.haveGetRecord ) {
        await this.getMissionRecord();
      }
      if(this.data.missionRecord) {
        const data = this.data.missionRecord.find(item => {
          return item.mission_content === '每日签到'; 
        });
        
        console.log(data, this.data.missionRecord)
        if(data){
          this.setData({
            signMissionData: data,
          })
          await this.updateSignMission(data);
        }
      }
     
    },
    updateUserIntegeral(data){
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'updateUser',
          data: {
            integral: data.mission_integral
          }
        }
      }).then(resp => {
        console.log('签到后更新积分成功')
          console.log(resp, '签到状态');
        this.selectUserSignRecord();
      }).catch((e) => {

      })
    },
   async updateSignMission(data) {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'setOperator',
          data: {
            mission_id: data._id,
            operator_type: 'complete mission'
          }
        }
      }).then((resp) => {
        console.log('完成任务')
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          config: {
            env: this.data.envId
          },
          data: {
            type: 'updateMission',
            data: {
              id: data._id
            }
          }
        }).then(resp => {
          console.log('更新任务完成')
          wx.showToast({
            title: '完成任务',
            icon: 'success',
            duration: 2000
          });
          // 所有的签到任务完成后才执行签到
          this.updateSignRecord();
        })
      })
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
        console.log(resp, res, '查出所有签到记录');
        let specialList = [];
        for(let i = 0; i < resp.result.data.length; i++){
          specialList.push({date: resp.result.data[i].sign_date, background: '#ffccff'})
        }
        console.log(specialList, 'specialList')
        this.setData({
          signRecords: resp.result.data,
          selected: res,
          speciallist: specialList,
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
        console.log(time,'点击确定111');
        // this.userSign({
        //   currentDate: (new Date()).getTime()
        // })
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