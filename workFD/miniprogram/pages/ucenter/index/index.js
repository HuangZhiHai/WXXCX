const app = getApp()

Page({
  data: {
    aboutUsTitle: '',
    aboutUsContent: '',
    servicePhoneNumber: '',
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_t: 0,
    score_sign_continuous: 0,
    iconSize: 45,
    iconColor: '#999999',
    days: [],
    signUp: [],
    cur_year: 0,
    cur_month: 0,
    count: 0
  },
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()
    that.onShow()
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onLoad() {
    let that = this;
    that.setData({
      version: app.globalData.version,
      background_color: app.globalData.globalBGColor,
      bgRed: app.globalData.bgRed,
      bgGreen: app.globalData.bgGreen,
      bgBlue: app.globalData.bgBlue
    })

    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }else{
      that.getNowDateParams();
    }
   
  },
  getNowDateParams(){
    //获取当前年月  
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    //获取当前用户当前任务的签到状态
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    })
  },
  onShow() {
    var that = this;
    that.getUserAmount();
    that.checkScoreSign();
    that.getAboutUs();
    that.getservicePhoneNumber();

    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      that.setData({
        userInfo: userInfo,
      })
    }
    that.getNowDateParams();
    
  },
  aboutUs: function () {
    var that = this
    wx.showModal({
      title: '关于我',
      content: '没啥可说的，程序猿一枚，攻城狮一个',
      showCancel: false
    })
  },
  makePhoneCall: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.servicePhoneNumber,
      success: function (res) { },
      fail: function (res) {
        wx.showModal({
          title: '呼叫失败',
          content: '请稍后再试',
          showCancel: false,
        })
      },
      complete: function (res) { },
    })
  },
  getPhoneNumber: function (e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      console.log(e.detail.errMsg)
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data: {
        token: wx.getStorageSync('token'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  
  getUserAmount: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
            freeze: res.data.data.freeze,
            score: res.data.data.score
          });
        }
      }
    })

  },
  getAboutUs: function () {
    var that = this
    //  获取关于我们Title
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/config/get-value',
      data: {
        key: 'aboutUsTitle'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            aboutUsTitle: res.data.data.value
          })
        }
      }
    })
    //  获取关于我们内容
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/config/get-value',
      data: {
        key: 'aboutUsContent'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            aboutUsContent: res.data.data.value
          })
        }
      }
    })
  },
  getservicePhoneNumber: function () {
    var that = this
    //  获取客服电话
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/config/get-value',
      data: {
        key: 'servicePhoneNumber'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            servicePhoneNumber: res.data.data.value
          })
        }
      }
    })
  },
  checkScoreSign: function () {
    var that = this;
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
      mask:true
    });
    wx.request({
      url: getApp().globalData.url + '/api/checkscoresign.action',
      data: {
        token: wx.getStorageSync('uid')
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            score_sign_t: res.data.score_sign_t,
            score_sign_continuous: res.data.data
          });
          wx.setStorageSync('score_sign_continuous', res.data.data);
        }
      },fail:function(){
         wx.hideLoading()
      }
    })
  },
  scoresign: function () {//签到
    var that = this;
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    var userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: getApp().globalData.url +'/api/scoresign.action',
      data: {
        token: wx.getStorageSync('uid'),
        nickName: encodeURI(userInfo.nickName),
        city: encodeURI(userInfo.city),
        country: encodeURI(userInfo.country),
        province: encodeURI(userInfo.province),
        gender: encodeURI(userInfo.gender),
        avatarUrl: encodeURI(userInfo.avatarUrl)
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          // that.getUserAmount();
          that.checkScoreSign();
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  scoresignDate: function (e) {//指定日期签到
    var that = this;
    let day = e.currentTarget.dataset.day;//日
    let month = e.currentTarget.dataset.month;//月
    let year = e.currentTarget.dataset.year;//年
    let j = e.currentTarget.dataset.j;//j
    let k = e.currentTarget.dataset.k;//k
    if (year == null || year == undefined || month == null || month == undefined || 
      day == null || day == undefined ){
        wx.showModal({
          title: '错误',
          content: "日历生产错误",
          showCancel: false
        })
        return 
      }
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    var userInfo = wx.getStorageSync('userInfo');
    var scoresignDate = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) ;
    wx.request({
      url: getApp().globalData.url + '/api/scoresignDate.action',
      data: {
        scoresignDate: scoresignDate,
        token: wx.getStorageSync('uid'),
        nickName: encodeURI(userInfo.nickName),
        city: encodeURI(userInfo.city),
        country: encodeURI(userInfo.country),
        province: encodeURI(userInfo.province),
        gender: encodeURI(userInfo.gender),
        avatarUrl: encodeURI(userInfo.avatarUrl)
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          var daysArr = that.data.days;
          daysArr[j + k].isSign = true;
          wx.setStorageSync('score_sign_continuous', that.data.count+1)
          that.setData({
            score_sign_continuous: that.data.score_sign_continuous+1,
            count: wx.getStorageSync('score_sign_continuous'),
            days: daysArr
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  showCalendar:function(){//展示日历
    this.getNowDateParams();
    this.onGetSignUp();
  },
  hideCalendar: function () {//隐藏日历
    this.setData({
      isRuleTrue: false
    })
  },
  relogin: function () {
    wx.navigateTo({
     url: "/pages/authorize/index"
    })
    this.onLoad()
  },
  recharge: function () {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function () {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  },
  // 获取当月共多少天
  getThisMonthDays: function (year, month) {
    return new Date(year, month, 0).getDate()
  },

  // 获取当月第一天星期几
  getFirstDayOfWeek: function (year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids: function (year, month) {
    var that = this;
    //计算每个月时要清零
    that.setData({ days: [] });
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date: null,
          isSign: false
        }
        that.data.days.push(obj);
      }
      this.setData({
        days: that.data.days
      });
      //清空
    } else {
      this.setData({
        days: []
      });
    }
  },

  // 绘制当月天数占的格子，并把它放到days数组中
  calculateDays: function (year, month) {
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        isSign: false
      }
      that.data.days.push(obj);
    }
    this.setData({
      days: that.data.days
    });
  },

  //匹配判断当月与当月哪些日子签到打卡
  onJudgeSign: function () {
    var that = this;
    var signs = that.data.signUp;
    var daysArr = that.data.days;
    for (var i = 0; i < signs.length; i++) {
      var current = new Date(signs[i]);
      var year = current.getFullYear();
      var month = current.getMonth() + 1;
      var day = current.getDate();
      day = parseInt(day);
      for (var j = 0; j < daysArr.length; j++) {
        //年月日相同并且已打卡
        if (year == that.data.cur_year && month == that.data.cur_month && daysArr[j].date == day) {
          daysArr[j].isSign = true;
        }
      }
    }
    that.setData({ days: daysArr });
  },

  // 切换控制年月，上一个月，下一个月
  handleCalendar: function (e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
      this.onGetSignUp();
     
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
      this.onGetSignUp();
      
    }
  },
  //获取当前用户该任务的签到数组
  onGetSignUp: function () {
    var that = this;
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    //获取当前年月  
    const date = new Date();
    const cur_year = that.data.cur_year;
    const cur_month = that.data.cur_month;
    var userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: getApp().globalData.url + '/api/findAllScoresignDays.action',
      data: {
        token: wx.getStorageSync('uid'),
        curyear: cur_year,
        curmonth: cur_month
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            isRuleTrue: true,
            signUp: res.data.data,
            count: wx.getStorageSync('score_sign_continuous')
          });
          that.onJudgeSign()
         
        } else {
          wx.showModal({
            title: '错误',
            content: '服务器异常',
            showCancel: false
          })
        }
      }
    })


  }
})