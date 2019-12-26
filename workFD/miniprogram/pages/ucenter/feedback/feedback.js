//var util = require('../../../utils/util.js');
//var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型', '功能异常','其他'],
    index: 0,
    inputTxt: '',
    textareaTxt:'',
    maxtextCount:500,
    textCount:0,
    phoneTrue:false,
    },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  clearMobileNumber: function(){
    this.setData({
      //更新页面input框显示
      inputTxt: ''
    })
  },
  textareaInput:function(e){
    this.setData({
      textareaTxt: e.detail.value,
      textCount: e.detail.value.length
    })
  },
  blurPhone:function(e){
    var phone = e.detail.value;
    let that = this
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        inputTxt: phone,
        phoneTrue: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 2000
        })
      }
    } else {
      this.setData({
        phoneTrue: true
      })
    }
  },
  summitFeedBack:function(e){
    let that = this
    let array = that.data.array
    let index = that.data.index
    let val = e.detail.value
    let phoneTrue = this.data.phoneTrue
    if (phoneTrue == true) {
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '加载中',
        icon: 'loading',
      });
      wx.request({
        url: getApp().globalData.url + '/api/toFeedBack.action',
        method: "GET",
        header: {
          "Content-Type": "application/json"
        },
        data: {
          token: wx.getStorageSync('uid'),
          fbType:encodeURI(array[index]),
          textareaTxt: encodeURI(that.data.textareaTxt),
          inputTxt: that.data.inputTxt
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000,
              success:function(){
                setTimeout(function(){
                  wx.navigateBack({
                    data: '1'
                  })
                },2000)
                
              }
            })
          } else if (res.data.code == 400) {
            wx.showToast({
              title: '提交失败',
              icon: 'success',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '服务未启用',
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '服务器未启用',
            icon: 'success',
            duration: 2000
          })
        }
      })
      //表单提交进行
    } else {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 2000
      })
    }
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})