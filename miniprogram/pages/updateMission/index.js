Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetRecord: false,
    envId: '',
    operateType: '',
    record: '',
    operatorType: {
      COMPLETE_MISSION: 'complete mission',
      EXCHANGE_REWARDS: 'exchange rewards'
    }
  },

  onLoad(options) {
    this.setData({
      envId: options.envId
    });
  },

  onShow(){
    this.getRecord();
  },

  toAddMission(e) {
    this.data.operateType = e.currentTarget.dataset.type;
    console.log(e, '2222222222222222', e.currentTarget.dataset.type, this.data)
    let missionData = this.editMissionModal(e);
    let data = {
      envId: this.data.envId,
      type: this.data.operateType,
      missionData: this.data.operateType === 'edit' ? missionData : {},
    };
    console.log(data)
    console.log(missionData, 'missionData')
    data = JSON.stringify(data);
    wx.navigateTo({
      url: `/pages/addMission/index?data=${data}`
    });
  },
  // // envId=${this.data.envId}?type=${this.data.operateType}`,

  showMissionModal(event){
    const missionId = event.target.id;
    const data = this.data.record.find(item => {
      return item._id === missionId
    })
    const deleteRewards = this.deleteRewards;
    wx.showModal({
      title: '请确认',
      content: '删除 '+data.mission_content,
      success (res) {
        if (res.confirm) {
          deleteRewards(data)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  editMissionModal(event){
    const missionId = event.target.id;
    const data = this.data.record.find(item => {
      return item._id === missionId; 
    })
    const updateRewards = this.updateRewards;
    console.log(updateRewards, 'updateRewards');
    return data;
    // this.toAddMission(event);
  },

  updateRewards(data){
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        event: this.data.eventId,
      },
      data: {
        type:  'updateMission',
        data: {
          id: data._id,
        }
      }
    }).then(resp => {
      this.getRecord();
    })
  },

  deleteRewards(data){
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'deleteMission',
        data: {
          id: data._id
        }
      }
    }).then(resp => {
      this.getRecord()
    })
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
        record: resp.result.data
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

  clearRecord() {
    this.setData({
      haveGetRecord: false,
      record: ''
    });
  }
});
