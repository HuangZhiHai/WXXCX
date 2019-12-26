
// app.js
var app = getApp();
App({
  
  onLaunch: function () {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        
        let statusBarHeight = res.statusBarHeight,
           navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
           navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
        this.globalData.statusBarHeight = statusBarHeight;
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.screenHeight = res.screenHeight;
      },
      fail(err) {
        
        console.log(err);
      }
    })
    
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync(' logs ') || []
    logs.unshift(Date.now())
    wx.setStorageSync(' logs ', logs)
   
  },
  onShow(e) {
    wx.setStorageSync('cardUid', e.query.cardUid)
    wx.setStorageSync('referrer', e.query.cardUid)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == " function " && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == " function " && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    // url: 'https://www.hzh.ink',
    url: 'https://127.0.0.1',
    userInfo: null,
    location: " ",
    loginData: " ",
    version: "1.4.2",
    globalBGColor: '#00acd4',
    bgRed: 0,
    bgGreen: 175,
    bgBlue: 180
  }
})