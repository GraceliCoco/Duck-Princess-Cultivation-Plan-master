// pages/addPersonalInfo/index.js
Page({
    data: {
        form: {
          userName: '',
          telNumber: '',
          addrDetail: '',
          region: ['请选择省市区/县', '', ''], // 省市区数据 第一个可以当placeholder
        },
        errorMsg: '', // 验证表单显示错误信息
        customItem: '', // 自定义picker显示的内容
        rules: [
          {
            name: 'userName',
            rules: {required: true, message: '请填写收货人姓名'},
          },
          {
            name: 'telNumber',
            rules: [{required: true, message: '请填写收货人电话'}, {mobile: true, message: '电话格式不对'}]
          },
          {
            name: 'addrDetail',
            rules: {required: true, message: '请填写详细地址'}
          },
        ],
      },
      externalClasses: ['form_item','form_item_region'],
      Postcode: '', // 邮编
    // 省市区选择事件
      bindRegionChange(e) {
        const {value, code, postcode} = e.detail
        // console.log(code) // 统计用区划代码
        // postcode 是邮政编码
        this.Postcode = postcode
        this.setData({
          'form.region': value
        })
      },
    formInputChange(e) {
        const {field} = e.currentTarget.dataset
        this.setData({
          [`form.${field}`]: e.detail.value
        })
      },
    // weui提交表单
      weSubmitForm() {
        const {userName, telNumber, region, addrDetail} = this.data.form
        const validRegion = region.filter(v => v) // 提取有效值
        this.selectComponent('#form').validate((valid, errors) => {
          if (!valid) {
            const firstError = Object.keys(errors);
            if (firstError.length) {
              this.setData({
                errorMsg: errors[firstError[0]].message
              })
            }
          } else if (validRegion.length < 2) {
            this.setData({
              errorMsg: '请选择省市区'
            })
          } else {
            wx.showToast({
              title: '提交成功',
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
    // 重置表单
      restForm() {
        this.setData({
          'form.userName': '',
          'form.telNumber': '',
          'form.addrDetail': '',
          'form.region': ['请选择省市区/县', '', '']
        })
        wx.navigateBack({
          delta: 1
        })
      },
})
