const WXAPI = require('apifm-wxapi')
var app = getApp();
var starscore = require("../../utils/starscore/starscore.js");
//var server = require('../../utils/server');
Page(Object.assign({},{
  data: {
    onLoadStatus: true,
    indicatorDots: true,
    loadingStatus: false, // loading
    loadingFinish: false,
    showMpjbutton: false,
    openShare: false,
    height:'',
    categoryList: [],
    kActionType: {},
    content: '...',
    qrcode: undefined,
    firstName: '',//名字
    photoFilePath: '../images/hzh_meitu_1.jpg',//头像
    nickName: '',//昵称
    lastName: '',//姓氏
    middleName: '',//中间名
    mobilePhoneNumber: '',//电话号
    weChatNumber: '',//微信号
    addressCounty: '',//联系地址国家
    addressState: '',//联系地址省份
    addressCity: '',//联系地址城市
    addressStreet: '',//联系地址街道
    addressPostalCode: '',//联系地址邮政编码
    organization: '',//公司
    title: '',//职位
    email: '',//邮箱
    url: '',//网站
    nowTime:'',
    loveUrl:'',//爱心网站
    qrcord:'',
  },
  
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()
//

    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onLoad: function (options) {
    var that = this
    
    // wx.setNavigationBarTitle({
    //   title: wx.getStorageSync('mallName')
    // })
    that.setData({
      background_color: app.globalData.globalBGColor,
      bgRed: app.globalData.bgRed,
      bgGreen: app.globalData.bgGreen,
      bgBlue: app.globalData.bgBlue
    })
    

    //获取系统信息  
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.width = res.windowWidth / 2.9  //2.6
        that.height = res.windowWidth / 2.9  //2.6
        that.setData({
          height: app.globalData.windowHeight - 90 - app.globalData.navHeight - 50
        })
      }
    })
    //console.log(this.width, this.height)
    if (!that.data.onLoadStatus) {
      that.showDialog('.onLoad-err')
    }
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    var url = getApp().globalData.url + '/wx_01/getPersonalData.action';
    wx.request({
      url: url,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          photoFilePath: res.data.photoFilePath == undefined ? that.data.photoFilePath : getApp().globalData.url + res.data.photoFilePath,
          nickName: res.data.nickName == undefined ? '' : res.data.nickName,
          title: res.data.title == undefined ? '' : res.data.title,
          mobilePhoneNumber: res.data.mobilePhoneNumber == undefined ? '' : res.data.mobilePhoneNumber,
          firstName: res.data.firstName == undefined ? '' : res.data.firstName,
          lastName: res.data.lastName == undefined ? '' : res.data.lastName,
          middleName: res.data.middleName == undefined ? '' : res.data.middleName,
          nickName: res.data.nickName == undefined ? '' : res.data.nickName,
          weChatNumber: res.data.weChatNumber == undefined ? '' : res.data.weChatNumber,
          addressCounty: res.data.addressCounty == undefined ? '' : res.data.addressCounty,
          addressState: res.data.addressState == undefined ? '' : res.data.addressState,
          addressCity: res.data.addressCity == undefined ? '' : res.data.addressCity,
          mobilePhoneNumber: res.data.mobilePhoneNumber == undefined ? '' : res.data.mobilePhoneNumber,
          addressStreet: res.data.addressStreet == undefined ? '' : res.data.addressStreet,
          addressPostalCode: res.data.addressPostalCode == undefined ? '' : res.data.addressPostalCode,
          organization: res.data.organization == undefined ? '' : res.data.organization,
          email: res.data.email == undefined ? '' : res.data.email,
          url: res.data.url == undefined ? '' : res.data.url,
          categoryList: res.data.categoryList == undefined ? '' : res.data.categoryList,
          nowTime: res.data.nowTime == undefined ? '' : res.data.nowTime,
          loveUrl: res.data.loveUrl == undefined ? '' : res.data.loveUrl,
          qrcord: res.data.qrcord == undefined ? '' : res.data.qrcord,
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
    * 生命周期函数--监听页面显示
    */
   onShow() {
     WXAPI.queryConfigBatch('mallName,DEFAULT_FRIEND_UID').then(function (res) {
      if (res.code == 0) {
        res.data.forEach(config => {
          wx.setStorageSync(config.key, config.value);
        })
      }
    })

    const cardUid =  this.getCardUid()
    this.getCardInfo(cardUid)
    const qrcode = wx.getStorageSync('_haibaoimg_qrcode')
    if (!qrcode) {
      // 获取二维码
      WXAPI.wxaQrcode({
        scene: cardUid,
        page: 'pages/card/main',
        is_hyaline: false,
        expireHours: 1
      }).then(res => {
        if (res.code == 0) {
          wx.setStorageSync('_haibaoimg_qrcode', res.data)
          this.setData({
            qrcode: res.data
          })
        }
      })
    } else {
      this.setData({
        qrcode
      })
    }
  },
   getCardUid() {
    let cardUid = wx.getStorageSync('cardUid')
    const uid = wx.getStorageSync('uid')
    if (!cardUid) {
      // 没有通过链接或者扫码进来
      if (uid) {
        // 当前用户已登录
        const res =  WXAPI.userDetail(wx.getStorageSync('token'))
        if (res.code == 0 && res.data.userLevel && res.data.userLevel.name === 'aicard') {
          return uid
        }
      }
      // 读取默认设置
      cardUid = wx.getStorageSync('DEFAULT_FRIEND_UID')
    }
    return cardUid
  },
   getCardInfo(cardUid) {
    const uid = wx.getStorageSync('uid')
    const token = wx.getStorageSync('token')
    if (uid) {
      // 添加到我的名片夹
      WXAPI.addFriend(token, cardUid)
    }
    // 读取名片详情信息
    const res =  WXAPI.friendUserDetail(token, cardUid)
    if (res.code == 0) {
      const _data = {
        kActionType: {}
      }
      if (res.data.userLevel && res.data.userLevel.maxUser && res.data.userLevel.maxUser > 1) {
        _data.showMpjbutton = true
      }
      _data.cardUserInfo = res.data
      if (_data.cardUserInfo.ext) {
        Object.keys(_data.cardUserInfo.ext).forEach(k => {
          // kActionType
          const v = _data.cardUserInfo.ext[k]
          _data.kActionType[k] = v
        })
      }
      wx.setNavigationBarTitle({
        title: _data.cardUserInfo.base.nick + ' - ' + wx.getStorageSync('mallName')
      })
      this.setData(_data)
    }
  },
  //onReady生命周期函数，监听页面初次渲染完成  
  onReady: function () {
    //调用canvasClock函数  
    this.canvasClock()
    //对canvasClock函数循环调用  
    this.interval = setInterval(this.canvasClock, 1000)
  },
  canvasClock: function () {
    var context = wx.createCanvasContext(this.canvasId, this)//创建并返回绘图上下文（获取画笔）  
    //设置宽高  
    var width = this.width
    var height = this.height
    var R = width / 4.5;//设置文字距离时钟中心点距离  
    //重置画布函数  
    function reSet() {
      context.height = context.height;//每次清除画布，然后变化后的时间补上  
      context.translate(width / 2.9, height / 2.9);//设置坐标轴原点  
      context.save();//保存中点坐标1  
    }
    //绘制中心圆和外面大圆  
    function circle() {
      //外面大圆  
      /*context.setLineWidth(1);
      context.beginPath();
      context.arc(0, 0, width / 2 - 30, 0, 2 * Math.PI, true);
      context.closePath();
      context.stroke();*/
      //中心圆  
      context.beginPath();
      context.arc(0, 0, 1.5, 0, 2 * Math.PI, true);
      context.closePath();
      context.stroke();
    }
    //绘制字体  
    function num() {
      // var R = width/2-60;//设置文字距离时钟中心点距离  
      context.setFontSize(width / 14)//设置字体样式  
      context.textBaseline = "middle";//字体上下居中，绘制时间  
      for (var i = 1; i < 13; i++) {
        //利用三角函数计算字体坐标表达式  
        var x = R * Math.cos(i * Math.PI / 6 - Math.PI / 2);
        var y = R * Math.sin(i * Math.PI / 6 - Math.PI / 2);
        if (i == 11 || i == 12) {//调整数字11和12的位置  
          context.fillText(i, x - width / 23, y + width / 50);
        } else if (i == 10) {//调整数字10的位置
          context.fillText(i, x - width / 25, y + width / 40);
        }
        else {
          context.fillText(i, x - width / 45, y);
        }
      }
    }
    //绘制小格  
    function smallGrid() {
      context.setLineWidth(0.5);
      context.rotate(-Math.PI / 2);//时间从3点开始，倒转90度  
      for (var i = 0; i < 60; i++) {
        context.beginPath();
        context.rotate(Math.PI / 30);
        context.moveTo(width / 3.425, 0);
        context.lineTo(width / 3.75, 0);
        context.stroke();
      }
    }
    //绘制大格  
    function bigGrid() {
      context.setLineWidth(1);
      for (var i = 0; i < 12; i++) {
        context.beginPath();
        context.rotate(Math.PI / 6);
        context.moveTo(width / 3.42, 0);
        context.lineTo(width / 3.85, 0);
        context.stroke();
      }
    }
    //指针运动函数  
    function move() {
      var t = new Date();//获取当前时间  
      var h = t.getHours();//获取小时  
      h = h > 12 ? (h - 12) : h;//将24小时制转化为12小时制  
      var m = t.getMinutes();//获取分针  
      var s = t.getSeconds();//获取秒针  
      context.save();//再次保存2  
      //旋转角度=30度*（h+m/60+s/3600）  
      //分针旋转角度=6度*（m+s/60）  
      //秒针旋转角度=6度*s  

      //绘制时针  
      context.setLineWidth(1.2);
      context.beginPath();
      context.rotate((Math.PI / 6) * (h + m / 60 + s / 3600));
      context.moveTo(-width / 24, 0);//指针开始位置
      context.setLineCap('round')
      context.lineTo(width / 9, 0);//指针结束位置，可以决定指针长度
      context.stroke();
      context.restore();//恢复到2,（最初未旋转状态）避免旋转叠加  
      context.save();//3  
      //画分针  
      context.setLineWidth(0.8);
      context.beginPath();
      context.rotate((Math.PI / 30) * (m + s / 60));
      context.moveTo(-width / 24, 0);
      context.lineTo(width / 7.2, 0);
      context.stroke();
      context.restore();//恢复到3，（最初未旋转状态）避免旋转叠加  
      context.save();
      //绘制秒针  
      context.setLineWidth(0.5);
      context.beginPath();
      context.rotate((Math.PI / 30) * s);
      context.moveTo(-width / 24, 0);
      context.lineTo(width / 6.2, 0);
      context.stroke();
    }
    //调用  
    function drawClock() {
      reSet();
      circle();
      num();
      smallGrid();
      bigGrid();
      move();
    }
    drawClock()//调用运动函数  
    // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为  
    wx.drawCanvas({
      canvasId: 'myCanvas',
      actions: context.getActions()
    })
  },
  //页面卸载，清除画布绘制计时器  
  onUnload: function () {
    clearInterval(this.interval)
  },
  showDialog: function (dialogName) {
    let dialogComponent = this.selectComponent(dialogName)
    dialogComponent && dialogComponent.show();
  },
  hideDialog: function (dialogName) {
    let dialogComponent = this.selectComponent(dialogName)
    dialogComponent && dialogComponent.hide();
  },
  onConfirm: function () {
    this.hideDialog('.onLoad-err')
    this.reLoad()
  },
  onCancel: function () {
    this.hideDialog('.onLoad-err')
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      title: '您好，我是 ' + (this.data.title == '' ? '***' : this.data.title) + ' ,' + (this.data.firstName == '' ? '***' : this.data.firstName)+ '，请惠存我的名片。',
      // path: '/pages/card/main?cardUid=' + this.data.cardUserInfo.base.id,
      imageUrl: this.data.photoFilePath
    }
  },
  callPhone() {
    if (this.data.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '暂时无法拨打',
        success: function (res) {
          if (res.confirm) {

          } else {

          }
        }
      })
    }else{
      wx.makePhoneCall({
        phoneNumber: this.data.mobilePhoneNumber
      })
    }
  },
  copyData(e) {
    const v = e.currentTarget.dataset.v
    wx.setClipboardData({
      data: v,
      success: (res) => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })
  },
  goIndex() {
    wx.navigateTo({
      url: '/pages/index/main'
    })
  },
  createHaibao() { // 生成海报
    wx.chooseImage({
      count: 1,
      success: (res) => {
        wx.setStorageSync('_haibaoimg', res.tempFilePaths[0])
        this.cardposter()
      }
    })
    // let token = wx.getStorageSync('token');
    // if (token){
    //   wx.chooseImage({
    //     count: 1,
    //     success: (res) => {
    //       wx.setStorageSync('_haibaoimg', res.tempFilePaths[0])
    //       this.cardposter()
    //     }
    //   })
    // }else{
    //   //跳转授权
    //     wx.navigateTo({
    //       url: "/pages/authorize/index"
    //     })
    // }
  },
  cardposter() {
    wx.navigateTo({
      url: '/pages/cardposter/main?cardUid=' + this.data.nowTime + '&qrcord=' + this.data.qrcord
    })
  },
  addPhoneContact() {
    // wx.showModal({
    //   title: '提示',
    //   content: '暂时未开放',
    //   success: function (res) {
    //     if (res.confirm) {

    //     } else {

    //     }
    //   }
    // })
    // 调用登录接口
    wx.addPhoneContact({
      firstName: this.data.firstName,//名字
      photoFilePath: this.data.photoFilePath,//头像
      nickName: this.data.nickName,//昵称
      lastName: this.data.lastName,//姓氏
      middleName: this.data.middleName,//中间名
      mobilePhoneNumber: this.data.mobilePhoneNumber,//电话号
      weChatNumber: this.data.weChatNumber,//微信号
      addressCounty: this.data.addressCounty,//联系地址国家
      addressState: this.data.addressState,//联系地址省份
      addressCity: this.data.addressCity,//联系地址城市
      addressStreet: this.data.addressStreet,//联系地址街道
      addressPostalCode: this.data.addressPostalCode,//联系地址邮政编码
      organization: this.data.organization,//公司
      title: this.data.title,//职位
      email: this.data.email,//邮箱
      url: this.data.url,//网站
    })
  },
  toLoveUrl(e) {
   
    var url = this.data.loveUrl
    if (url == ''){
       wx.showModal({
      title: '提示',
      content: '对不起，您没有权限访问！',
      success: function (res) {
        if (res.confirm) {

        } else {

        }
      }
    })
    }
    
    wx.navigateTo({
      url: '/pages/news-detail/main?url=' + url
    })

  }
}));

