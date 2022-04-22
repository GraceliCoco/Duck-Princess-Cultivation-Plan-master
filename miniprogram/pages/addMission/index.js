Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetRecord: false,
    envId: '',
    record: '',
    chosen: '',
    imgSrc: '',

    type: '',
    missionData: {},
    mission_id: '',
    radioItems: [
      {id: 0, name: '是', value: true, checked: 'true'},
      {id: 1, name: '否', value: false, }
    ],
    is_need_reset: true,
    is_display: '',
    is_finished: '',
  },

  onLoad(options) {
    options = JSON.parse(options.data);
    this.setData({
      envId: options.envId,
      type: options.type,
      missionData: options?.missionData || {},
      // is_need_reset: options?.is_need_reset || true,
    });
    if(options.type === 'edit') {
      this.setData({
        imgSrc: options.missionData.mission_image,
        mission_content: options.missionData.mission_content,
        mission_integral: options.missionData.mission_integral,
        mission_id: options.missionData._id,
        is_need_reset: options.missionData.is_need_reset,
        is_display: options.missionData.is_display,
        is_online: options.missionData.is_online,
        is_finished: options.missionData.is_finished,
        haveGetImgSrc: options.missionData.mission_image === '' ? false : true,
      })
      wx.setNavigationBarTitle({
        title: '修改任务'
      });
    }else{
      this.setData({
        is_display: true,
        is_need_reset: true,
        is_finished: false,
        is_online: true,
      })
      wx.setNavigationBarTitle({
        title: '新增任务',
      })
    }
    this.changeRadioCheckedItem(this.data.is_need_reset);
  },

  changeRadioCheckedItem(val) {
    let res = [];
    this.data.radioItems.forEach(item => {
      if(item.value === val) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      res.push(item);
    });
    this.setData({
      radioItems: res
    })
  },

  radioChange: function(e) {
    let isNeedReset = e.detail.value;
    this.setData({
      is_need_reset: isNeedReset
    });
  },

  formSubmit(e) {
    wx.showLoading();
    const data = e.detail.value;
    let aaa =  {
      mission_content: data.mission_content,
      mission_integral: data.mission_integral,
      mission_image: this.data.imgSrc,
      mission_id: this.data.type ==='add' ? '' : this.data.mission_id,
      is_finished: this.data.is_finished,
      is_online: this.data.is_online,
      is_need_reset: JSON.parse(this.data.is_need_reset),
      is_display: this.data.is_display,
    };
    if (data.mission_content && data.mission_integral){
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: this.data.type === 'add' ? 'addMission': 'editMission',
          data: {
            mission_content: data.mission_content,
            mission_integral: data.mission_integral,
            mission_image: this.data.imgSrc,
            mission_id: this.data.type ==='add' ? '' : this.data.mission_id,
            is_finished: this.data.is_finished,
            is_online: true,
            is_need_reset: JSON.parse(this.data.is_need_reset),
            is_display: true,
          }
        }
      }).then(resp => {
        wx.hideLoading()
        wx.showToast({
          title: this.data.type === 'add' ? '新增成功' : '修改成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              wx.navigateBack();
            }, 2000)
          }
        })
      })
    } else {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'error',
        duration: 2000
      })
    }
    
  },

  formReset(e) {
    this.setData({
      chosen: ''
    })
  },

  uploadImg() {
    wx.showLoading({
      title: '',
    });
    // 让用户选择一张图片
    wx.chooseImage({
      count: 1,
      success: chooseResult => {
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: new Date().getTime()+'.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          config: {
            env: this.data.envId
          }
        }).then(res => {
          this.setData({
            haveGetImgSrc: true,
            imgSrc: res.fileID
          });
          wx.hideLoading();
        }).catch((e) => {
          wx.hideLoading();
        });
      },
    });
  },

  clearImgSrc() {
    this.setData({
      haveGetImgSrc: false,
      imgSrc: ''
    });
  }

});
