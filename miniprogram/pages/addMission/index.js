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
  },

  onLoad(options) {
    options = JSON.parse(options.data);
    console.log(options, 'in setData add Mission page')
    this.setData({
      envId: options.envId,
      type: options.type,
      missionData: options?.missionData || {}
    });
    if(options.type === 'edit') {
      this.setData({
        imgSrc: options.missionData.mission_image,
        mission_content: options.missionData.mission_content,
        mission_integral: options.missionData.mission_integral,
        mission_id: options.missionData._id,
        haveGetImgSrc: options.missionData.mission_image === '' ? true : false,
      })
      console.log(this.data.imgSrc, this.data, 'data1234')
      wx.setNavigationBarTitle({
        title: '修改任务'
      });
    }else{
      wx.setNavigationBarTitle({
        title: '新增任务',
      })
    }
  },

  formSubmit(e) {
    wx.showLoading();
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    const data = e.detail.value;
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
            is_finished: false,
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
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
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
          console.log('上传成功', res);
          this.setData({
            haveGetImgSrc: true,
            imgSrc: res.fileID
          });
          wx.hideLoading();
        }).catch((e) => {
          console.log(e);
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
