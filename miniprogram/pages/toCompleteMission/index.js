Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetRecord: false,
    envId: '',
    record: '',
    operatorType: {
      COMPLETE_MISSION: 'complete mission',
      EXCHANGE_REWARDS: 'exchange rewards'
    }, 
    originRecord: []
  },

  onLoad(options) {
    this.setData({
      envId: options.envId
    });
    this.getRecord();
  },

  showMissionModal(event){
    const missionId = event.target.id;
    const data = this.data.record.find(item => {
      return item._id === missionId
    })
    const completeMission = this.completeMission
    wx.showModal({
      title: '请确认',
      content: '完成 '+data.mission_content,
      success (res) {
        if (res.confirm) {
          completeMission(data)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  showResetMissionModal(event){
    const missionId = event.target.id;
    const data = this.data.record.find(item => {
      return item._id === missionId
    })
    const completeResetMission = this.completeResetMission
    wx.showModal({
      title: '请确认',
      content: '重启 '+data.mission_content,
      success (res) {
        if (res.confirm) {
          completeResetMission(data)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  completeResetMission(mission) {
    wx.showLoading();
    const data = mission;
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'editMission',
        data: {
          mission_id: mission._id,
          mission_content: mission.mission_content,
          mission_integral: mission.mission_integral,
          mission_image: mission.mission_image,
          is_finished: false,
          is_need_reset: mission.is_need_reset,
          is_display: mission.is_display,
        }
      }
    }).then(resp => {
        wx.hideLoading();
        this.getRecord()
        wx.showToast({
          title: '重置成功',
          icon: 'success',
          duration: 2000
        })
      })
  },

  completeMission(mission) {
     wx.showLoading();
     wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'setOperator',
        data: {
          mission_id: mission._id,
          operator_type: 'complete mission'
        }
      }
    }).then((resp) => {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'updateUser',
          data: {
            integral: mission.mission_integral
          }
        }
      }).then(resp => {
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          config: {
            env: this.data.envId
          },
          data: {
            type: 'updateMission',
            data: {
              id: mission._id
            }
          }
        }).then(resp => {
          this.getRecord();
          wx.showToast({
            title: '完成任务',
            icon: 'success',
            duration: 2000
          })
        })
      })
    }).catch((e) => {
   });
  },

  getRecord() {
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
      this.setData({
        haveGetRecord: true,
        record: resp.result.data.filter(item => item.is_display),
        originRecord: resp.result.data,
      });
      wx.hideLoading();
   }).catch((e) => {
      this.setData({
        showUploadTip: true
      });
     wx.hideLoading();
   });
  },

  clearRecord() {
    this.setData({
      haveGetRecord: false,
      record: ''
    });
  }
});
