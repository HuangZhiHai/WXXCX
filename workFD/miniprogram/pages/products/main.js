Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    newsList: [
    ],
    content: '...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // wx.setNavigationBarTitle({
    //   title: wx.getStorageSync('mallName')
    // })
    //获取系统信息  
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.setData({
          height: getApp().globalData.windowHeight - 64 - getApp().globalData.navHeight
        })
      }
    })
    this.commonM();
  },
  commonM:function(){
    var that = this
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    var url = getApp().globalData.url + '/wx_01/getProductionData.action';
    wx.request({
      url: url,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        for (var i = 0; i < res.data.length; ++i) {
          res.data[i].pic = getApp().globalData.url + res.data[i].pic;
        }
        that.setData({
          newsList: res.data
        })
        wx.hideLoading();
      }, fail: function (res) {
        wx.showToast({
          title: '服务器出现错误',
          icon: 'none',
          duration: 2000
        })
      }
    });
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
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    this.commonM();
    setTimeout(function () {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      // 停止下拉动作  
      wx.stopPullDownRefresh();
    }, 500);

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  goDetail(e) {
    // wx.showModal({
    //   title: '提示',
    //   content: '暂时未开放',
    //   success: function (res) {
    //     if (res.confirm) {

    //     } else {

    //     }
    //   }
    // })
    var url = ''
    var that = this;
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    var url = getApp().globalData.url + '/wx_01/getProductionDataDetail.action';
    wx.request({
      url: url,
      method: "POST",
      data: { param: e.currentTarget.dataset.id },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/news-detail/main?url=' + res.data
        })
      }, fail: function (res) {
        wx.showToast({
          title: '服务器出现错误',
          icon: 'none',
          duration: 2000
        })
      }
    });

  }
})