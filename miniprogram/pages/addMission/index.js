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
      {id: 0, name: '是', value: 'true', checked: 'true'},
      {id: 1, name: '否', value: 'false', }
    ],
    is_need_reset: true,
    is_display: '',
  },

  onLoad(options) {
    options = JSON.parse(options.data);
    console.log(options, 'in setData add Mission page')
    this.setData({
      envId: options.envId,
      type: options.type,
      missionData: options?.missionData || {},
      is_need_reset: options?.is_need_reset || true,
    });
    if(options.type === 'edit') {
      this.setData({
        imgSrc: options.missionData.mission_image,
        mission_content: options.missionData.mission_content,
        mission_integral: options.missionData.mission_integral,
        mission_id: options.missionData._id,
        is_need_reset: options?.is_need_reset || true,
        is_display: options.missionData.is_display,
        haveGetImgSrc: options.missionData.mission_image === '' ? false : true,
      })
      console.log(this.data.imgSrc, this.data, 'data1234')
      wx.setNavigationBarTitle({
        title: '修改任务'
      });
    }else{
      this.setData({
        is_display: true,
      })
      wx.setNavigationBarTitle({
        title: '新增任务',
      })
    }
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      is_need_reset: e.detail.value
    })
  },

  formSubmit(e) {
    wx.showLoading();
    console.log('form发生了submit事件，携带数据为：', e.detail.value, this.data);
    const data = e.detail.value;
    let aaa =  {
      mission_content: data.mission_content,
      mission_integral: data.mission_integral,
      mission_image: this.data.imgSrc,
      mission_id: this.data.type ==='add' ? '' : this.data.mission_id,
      is_finished: false,
      is_online: true,
      is_need_reset: this.data.is_need_reset,
      is_display: true,
    };
    console.log(aaa, 'aaaaa')
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
            is_online: true,
            is_need_reset: this.data.is_need_reset,
            is_display: true,
          }
        }
      }).then(resp => {
        console.log(resp, 'resp')
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
