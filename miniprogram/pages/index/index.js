// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '数据库',
      tip: '安全稳定的文档型数据库',
      showItem: true,
      item: [{
        title: '完成任务',
        page: 'toCompleteMission'
      }, {
        title: '兑换奖励',
        page: 'toExchangeRewards'
      }, {
        title: '查询记录',
        page: 'selectRecord'
      },
      {
        title: '任务管理',
        page: 'updateMission'
      },
      {
        title: '奖励管理',
        page: 'updateRewards'
      },
      // {
      //   title: '信息设置',
      //   page: 'addPersonalInfo'
      // },
      // {
      //   title: '新版奖励管理',
      //   page: 'updateRewardsNew'
      // }
    ]
    }],
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    userIntegral: 0,
    userName: '',
    operatorType: {
      COMPLETE_MISSION: 'complete mission',
      EXCHANGE_REWARDS: 'exchange rewards'
    },
    calendarShow: false,
    currentDate: new Date("yyyy-MM-dd"),
    specialDays: [['2021-05-02','周年纪念日'],['2022-04-20','我的生日'],['2022-05-05','宝贝生日']],
    bgImgUrl: 'cloud://note-8gd2t5dbbdb0973e.6e6f-note-8gd2t5dbbdb0973e-1305725455/IMG_1255.png',

    is_user_sign: false,
  },

  onLoad(){
    this.resetMission();
  },

  onShow(){
    this.selectUser();
    this.selectUserSignRecord();
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail (res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  },

  selectUser() {
    wx.cloud.callFunction({
     name: 'quickstartFunctions',
     config: {
       env: this.data.envId
     },
     data: {
       type: 'selectUser',
     }
   }).then((resp) => {
     this.setData({
      userIntegral: resp.result.data[0].user_integral,
      userName: resp.result.data[0].user_name
     })
   }).catch((e) => {
  });
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
          currentDate: (new Date()).getTime(),
        }
      }
    }).then((resp) => {
      console.log(resp, '查完状态')
      this.setData({
        is_user_sign: resp.result.data[0].is_sign,
      })
    }).catch((e) => {
  });
 },

 userSign(datas){
  wx.cloud.callFunction({
    name: 'quickstartFunctions',
    config: {
      env: this.data.envId
    },
    data: {
      type: 'addSignRecord',
      data: {
        currentDate: datas.currentDate,
      }
    }
  }).then((resp) => {
    console.log(resp, '签到状态')
    this.setData({
      is_user_sign: true,
    })
  }).catch((e) => {
});
 },

  resetMission() {
    wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'selectOperator'
        }
      }).then((resp) => {
        const operatorData = resp.result.data.reverse();
        let lastMissionDate;
        operatorData.some(item => {
          if(item.operator_type === this.data.operatorType.COMPLETE_MISSION){
            lastMissionDate = new Date(item.operator_time).getDate();
            return true
          }
          return false
        })
        const currentDate = new Date().getDate();
        console.log('lastMissionDate', lastMissionDate)
        console.log('currentDate', currentDate)
        if (lastMissionDate !== currentDate){
          console.log('resetMission')
          wx.cloud.callFunction({
            name: 'quickstartFunctions',
            config: {
              env: this.data.envId
            },
            data: {
              type: 'resetMission'
            }
          }).then((resp) => {

          })
        }
        
    }).catch((e) => {
    });
  },
  showCanlendar(e){
    console.log(e, 'click the btn')
    this.setData({
      calendarShow: true
    });
    let component = this.selectComponent("#calendar");
    component.showCalendar();
    console.log(this.data.calendarShow)
  },
  // 日历被选中
  onSelectDate(e){
    console.log(e.detail)//输出所选择日期
    let component = this.selectComponent("#calendar");
    component.showCalendar();
    if(e.detail.date==="今天"){
      this.userSign({
        currentDate: (new Date()).getTime()
      })
    }
  }
});
