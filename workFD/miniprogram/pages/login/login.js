
// pages/login/login.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    width:'',
    disabled: false,
    no: '',
    pwd: '',
    noinput: false,
    pwdinput: false,
  },
  noinput: function (e) {
    var that = this
    that.setData({ no: e.detail.value });
    if (that.data.no != '' && that.data.pwd != '') {
      that.setData({ disabled: false });
    }else{
      that.setData({ disabled: true });
    }

  },
  pwdinput: function (e) {
    var that = this
    that.setData({ pwd: e.detail.value });
    if (that.data.no != '' && that.data.pwd != '') {
      that.setData({ disabled: false });
    } else {
      that.setData({ disabled: true });
    }
  },
  formSubmit: function (e) {
    var that = this
    wx.showLoading({
      title: '登录中...',
      icon: 'loading'
    })
    this.setData({ disabled: true });
   
    wx.request({
      url: getApp().globalData.url +'/login/login.action', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        "userName": e.detail.value.no,
        "password": e.detail.value.pwd
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'// 默认值
      },
      success: function (res) {
        if (res.data != null && res.data != '' && res.data != undefined){
          if (res.data.success) {
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1000
            })
            wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
            setTimeout(function () {
              getApp().globalData.loginData = res.cookies
              wx.switchTab({
                url: '../home/home',
              })
            }, 1000)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            that.setData({ disabled: false });
          }
        } else {
          wx.showToast({
            title: '服务器出现错误',
            icon: 'none',
            duration: 2000
          })
          that.setData({ disabled: false });
        }
      }, fail: function (res){
        console.log(res)
        wx.showToast({
          title: '服务器连接异常',
          icon: 'none',
          duration: 2000
        })
        that.setData({ disabled: false });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ disabled: false });
    
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight,
          width: res.windowWidth
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.no == '' || this.data.pwd == '') {
      this.setData({ disabled: true });
    } else {
      this.setData({ disabled: false });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
