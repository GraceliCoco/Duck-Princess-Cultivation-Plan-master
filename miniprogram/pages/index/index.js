// index.js
// const app = getApp()
const { envList } = require('../../envList.js');
const util = require('../../utils/util.js');
Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '数据库',
      tip: '安全稳定的文档型数据库',
      showItem: true,
      item: [{
        title: '🍧 完成任务',
        page: 'toCompleteMission'
      }, {
        title: '🍰 兑换奖励',
        page: 'toExchangeRewards'
      }, {
        title: '🍮 查询记录',
        page: 'selectRecord'
      },
      {
        title: '🧁 任务管理',
        page: 'updateMission'
      },
      {
        title: '🍩 奖励管理',
        page: 'updateRewards'
      },
      {
        title: '🎂 每日签到',
        page: 'daySign'
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
    currentDate: util.getFormatDate(new Date()),
    specialDays: [['2021-05-02','周年纪念日'],['2022-04-20','我的生日'],['2022-05-05','宝贝生日']],
    bgImgUrl: 'cloud://note-8gd2t5dbbdb0973e.6e6f-note-8gd2t5dbbdb0973e-1305725455/IMG_1255.png',

    is_user_sign: false,

    haveGetRecord: false,
    missionRecord: [],
  },

  onLoad(){
    this.resetMission();
  },

  onShow(){
    this.selectUser();


    this.selectUserSignRecord();
    this.isNeedAddSignMission();
  },

  async isNeedAddSignMission(){
    if(!this.data.haveGetRecord) {
      // let record = await this.getMissionRecord();
      // let that = this;
      let promise = this.getMissionRecord();
      promise.then(e=>{
        // 查询出所有的mission记录
        if(!this.data.missionRecord.length) {
          // 如果还没有记录，先创建一个sign的mission;
          this.addSignMission();
        } else {
          // 有mission记录但是找不到sign记录的，也创建一个sign记录
          const data = this.data.missionRecord.find(item => {
            return item.mission_content === '每日签到';
          });
          if(!data){
            this.addSignMission();
          }
        }
      },(error) => {
        console.log(error, '失败了')
      })

    }
    // let res = await wx.cloud.database().collection('mission').get();

  },

  addSignMission(){
    let data = {
      mission_content: '每日签到',
      mission_integral: 5,
      mission_image: '',
      mission_id: '',
      is_finished: false,
      is_online: true,
      is_need_reset: true,
      is_display: true,
    }
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'addMission',
        data: {
          mission_content: data.mission_content,
          mission_integral: data.mission_integral,
          mission_image: data.mission_image,
          mission_id: data.mission_id,
          is_finished: data.is_finished,
          is_online: data.is_online,
          is_need_reset: data.is_need_reset,
          is_display: data.is_display
        }
      }
    }).then(resp => {
      // console.log(resp,'新增签到任务');
    })
  },

  async getMissionRecord() {
    let that = this;
    let promise = new Promise(function(success, fail) {
      wx.showLoading({
        title: '',
      });
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: that.data.envId
        },
        data: {
          type: 'selectMission'
        }
      }).then((resp) => {
        success(resp);
        that.setData({
          haveGetRecord: true,
          missionRecord: resp.result.data
        });
        wx.hideLoading();
        return resp.result.data;
      }).catch((e) => {
        fail(e);
        that.setData({
          // showUploadTip: true
        });
       wx.hideLoading();
       return [];
      });
    });
    return promise;

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
        // console.log(res.errMsg);
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
        currentDate: util.getFormatDate(new Date()),
      }
    }
  }).then((resp) => {
    this.setData({
      is_user_sign: true,
    });
    wx.showToast({
      title: '签到成功',
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
        if (lastMissionDate !== currentDate){
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
    this.setData({
      calendarShow: true
    });
    let component = this.selectComponent("#calendar");
    component.showCalendar();
  },
  // 日历被选中
  onSelectDate(e){
    console.log(e.detail)//输出所选择日期
    let component = this.selectComponent("#calendar");
    component.showCalendar();
    if( e.detail.date=== "今天" ){
      if (!this.data.is_user_sign) {
        this.userSign({
          currentDate: (new Date()).getTime()
        })
      } else {
        wx.showToast({
          title: '您今日已签到',
        })
      }

    }
  }
});
