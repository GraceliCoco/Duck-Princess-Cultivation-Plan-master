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
    rewardData: {},
    reward_id: '',
  },

  onLoad(options) {
    options = JSON.parse(options.data);
    this.setData({
      envId: options.envId,
      type: options.type,
      rewardData: options?.rewardData || {}
    });
    if(options.type === 'edit') {
      this.setData({
        imgSrc: options.rewardData.goods_image,
        goods_content: options.rewardData.goods_content,
        goods_integral: options.rewardData.goods_integral,
        reward_id: options.rewardData._id,
        haveGetImgSrc: options.rewardData.goods_image ? true : false,
      })
      wx.setNavigationBarTitle({
        title: '修改奖励'
      });
    }else{
      wx.setNavigationBarTitle({
        title: '新增奖励',
      })
    }
  },

  formSubmit(e) {
    wx.showLoading()
    const data = e.detail.value;
    if (data.goods_content && data.goods_integral){
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: this.data.type === 'add' ? 'addGoods': 'editReward',
          // type: 'addGoods',
          data: {
            goods_content: data.goods_content,
            goods_integral: data.goods_integral,
            goods_image: this.data.imgSrc,
            reward_id: this.data.type === 'add' ? '' : this.data.reward_id,
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
              wx.navigateBack()
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
