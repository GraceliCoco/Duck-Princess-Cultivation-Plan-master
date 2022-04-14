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

  toAddRewards(e) {
    this.data.operateType = e.currentTarget.dataset.type;
    console.log(e, '2222222222222222', e.currentTarget.dataset.type, this.data)
    let rewardData = this.editRewardModal(e);
    let data = {
      envId: this.data.envId,
      type: this.data.operateType,
      rewardData: this.data.operateType === 'edit' ? rewardData : {},
    };
    console.log(data)
    console.log(rewardData, 'rewardData')
    data = JSON.stringify(data);
    wx.navigateTo({
      url: `/pages/addRewards/index?data=${data}`,
    });
  },

  showMissionModal(event){
    const goodsId = event.target.id;
    const data = this.data.record.find(item => {
      return item._id === goodsId
    })
    const deleteRewards = this.deleteRewards;
    wx.showModal({
      title: '请确认',
      content: '删除 '+data.goods_content,
      success (res) {
        if (res.confirm) {
          deleteRewards(data)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  editRewardModal(event){
    const rewardId = event.target.id;
    const data = this.data.record.find(item => {
      return item._id === rewardId; 
    })
    const updateRewards = this.updateRewards;
    console.log(updateRewards, 'updateRewards');
    return data;
  },

  updateRewards(data){
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        event: this.data.eventId,
      },
      data: {
        type:  'updateReward',
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
        type: 'deleteGoods',
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
        type: 'selectGoods'
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
