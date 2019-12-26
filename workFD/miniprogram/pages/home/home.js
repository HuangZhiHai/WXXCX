var time = require('../../utils/util.js');
// pages/home/home.js
Page({
    /**
   * 页面的初始数据
   */
  data: {
    totals:0,
    total: 0,
    commonUrl:'',
    page:'1',
    rows:'10',
    rule:[],
    // JSESSIONID:'',//jsessionId
    // companyBy: '',//组织ID
    // userId: '', //用户ID    
    // departmentName: '',//部门名称  
    // jobNumber: '',   //工号  
    // jobStatus: '',//状态     
    // name: '',//姓名     
    // postName: '',//部门名称     
    // sex: '',//性别     
    // username: '',//用户名     
    height: '',
    width: '',
    res: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    categoryList:{
      pageZero: [{
        id: "0",
        name: "Zero - 数据表格",
        src: "/pages/images/myhead.png"
      }],
      pageone:[{
        id: "1",
        name: "One - 数据表格",
        src: "/pages/images/comment_03.png"
      }]
      // ,
      // pagetwo: [{
      //   id: "2",
      //   name: "Two - 计量单位",
      //   src: "/pages/images/myhead.png"
      // }],
      // pageThree: [{
      //   id: "3",
      //   name: "Three - 存货类别",
      //   src: "/pages/images/comment_03.png"
      // }],
      // pageFour: [{
      //   id: "4",
      //   name: "Four - 人员管理",
      //   src: "/pages/images/myhead.png"
      // }],
      // pageFive: [{
      //   id: "5",
      //   name: "Five - 系统参数",
      //   src: "/pages/images/comment_03.png"
      // }],
      // pageSix: [{
      //   id: "6",
      //   name: "Six - 数据字典",
      //   src: "/pages/images/myhead.png"
      // }]
    },
    
    listHeadData: [
      '订单编号',	
      // '物料号',
      // '规格',
      '订单批次',	
      // '品名',
      '前序状态',
      '后序状态',
      '完工时间',
      '前派时间',
      '生产数量',
      '前派量',
      '前派剩量',
      '后派时间',
      '后派量',
      '后派剩量'
    ],
    listData: []

  },
  swiperTab: function (e) {
    this.onClickPicAndText(e);
    // console.log(e.detail.current)
    // this.setData({
    //   currentTab: e.detail.current
    // })
  },
  finish: function () {
    var that = this;
    // wx.request({
    //   url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/filter",
    //   method: "GET",
    //   success: function (res) {
    //     that.setData({
    //       restaurant: res.data.data.restaurant,
    //     })
    //   }
    // });
  },
  onClickPicAndText: function(e){
    var _this = this;
    var url = ''
    switch (e.currentTarget.id){
      case '0': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
      case '1': url = getApp().globalData.url + '/wx_01/findBasicList.action';break;
      case '2': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
      case '3': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
      case '4': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
      case '5': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
      case '6': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
    }
    if(url == ''){
      switch (e.detail.current+"") {
        case '0': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
        case '1': url = getApp().globalData.url + '/wx_01/findBasicList.action'; break;
        case '2': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
        case '3': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
        case '4': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
        case '5': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
        case '6': url = getApp().globalData.url + '/wx_01/findDataList.action'; break;
      }
    }
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    wx.request({
      url: url,
      method: "GET",
      data:{
        page: _this.data.page,
        rows: _this.data.rows
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie':'123456'
      },
      success: function (res) {
        console.log(res)
        _this.setData({
          commonUrl: url,
          listData: (res.data == null ? null : res.data.rows),
          total: (res.data.total == null ? 0 : res.data.total),
          totals: (res.data.rows == null ? 0 : res.data.rows.length)
        })
        wx.hideLoading();
      },fail:function(res){
        wx.showToast({
          title: '服务器出现错误',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loginData = getApp().globalData.loginData;
    var that = this;
    // that.setData({
    //   JSESSIONID: loginData.JSESSIONID,//jsessionId
    //   companyBy: loginData.companyBy,//组织ID
    //   userId: loginData.id, //用户ID    
    //   departmentName: loginData.departmentName,//部门名称  
    //   jobNumber: loginData.jobNumber,   //工号  
    //   jobStatus: loginData.jobStatus,//状态     
    //   name: loginData.name,//姓名     
    //   postName: loginData.postName,//部门名称     
    //   sex: loginData.sex,//性别     
    //   username: loginData.username//用户名     
    // })
   
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: getApp().globalData.windowHeight - 93 - 56 - getApp().globalData.navHeight-48 ,
          widthRem: that.data.listHeadData.length * 5 + 0.2 * (that.data.listHeadData.length-1)
        })
      }
    })
    var url = getApp().globalData.url + '/wx_01/findDataList.action?';
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    wx.request({
      url: url,
      method: "POST",
      data: {
        page: that.data.page,
        rows: that.data.rows
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded", 
        'cookie': '123456'
      },
      success: function (res) {
        that.setData({
          commonUrl: url,
          listData: res.data.rows,
          total: res.data.total,
          totals: (res.data.rows == null ? 0 : res.data.rows.length)
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
  lower() {
    var that = this;
    var result = that.data.listData;
    // var cont = result.concat(resArr);//合并请求的数据
    if (that.data.totals >= that.data.total) {
      wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '我也是有底线的',
        icon: 'success',
        duration: 300
      });
      return false;
    } else {
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '加载中',
        icon: 'loading',
      });
      wx.request({
        url: that.data.commonUrl,
        method: "GET",
        data: {
          page: that.data.page + 1,
          rows: that.data.rows
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'cookie': '123456'//wx.getStorageSync("sessionid")
        },
        success: function (res) {
          that.setData({
            listData: result.concat(res.data.rows),
            totals: that.data.totals + (res.data.rows == null ? 0 : res.data.rows.length)
          })
          
          setTimeout(function () {
            wx.hideLoading();
          }, 500);
        }, fail: function (res) {
          wx.showToast({
            title: '服务器出现错误',
            icon: 'none',
            duration: 2000
          })
        }
      });
    }
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
    
    var that = this;
    // wx.request({
    //   url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/info",
    //   method: "GET",
    //   success: function (res) {
    //     that.setData({
    //       restaurant: res.data.data.restaurant,
    //       location: wx.getStorageSync('location')
    //     })
    //   }
    // });
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
    // // 显示顶部刷新图标  
    // wx.showNavigationBarLoading();
    // var that = this;
    // wx.request({
    //   url: "https://6131-a19931109-b1db3a-1257788087.tcb.qcloud.la",
    //   method: "GET",
    //   header: {
    //     'content-type': 'application/text'
    //   },
    //   success: function (res) {
        
    //     // 隐藏导航栏加载框  
    //     wx.hideNavigationBarLoading();
    //     // 停止下拉动作  
    //     wx.stopPullDownRefresh();
    //   }
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  showRule: function (event) {
    var data = event.currentTarget.dataset.sizedata
    // 对象转成数组方式一
    var createArr = []
    createArr.push('订单编号：'+data.orderNumber);
    createArr.push('订单批次：' + data.orderBatch);
    createArr.push('前序状态：' + data.preStatus);
    createArr.push('后序状态：' + data.afterStatus);
    createArr.push('完工时间：' + data.deliverDate);
    createArr.push('前派时间：' + data.preDistributionDate);
    createArr.push('生产数量：' + data.productionQuantity);
    createArr.push('前派量：' + data.preDistributionQuantity);
    createArr.push('前派剩量：' + data.preResidueDistributionQuantity);
    createArr.push('后派时间：' + data.afterDistributionDate);
    createArr.push('后派量：' + data.afterDistributionQuantity);
    createArr.push('后派剩量：' + data.afterResidueDistributionQuantity);
    this.setData({
      isRuleTrue: true,
      rule: createArr
      
    })
  },
  hideRule: function () {
    this.setData({
      isRuleTrue: false
    })
  },
})