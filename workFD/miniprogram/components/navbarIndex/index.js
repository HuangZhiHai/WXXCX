// components/navbar/index.js 
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['custom-class'],
  /** 
   * 组件的属性列表 
   */
  properties: {
    pageName: String,
    showNav: {
      type: Boolean,
      value: true
    },
    bgColor: {
      type: String,
      value: '#00afb4'
    },
    iconColor: {
      type: String,
      value: '#000'
    }
  },

  /** 
   * 组件的初始数据 
   */
  data: {

  },
  lifetimes: {
    attached: function () {
      this.setData({
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop
      })
    }
  },
  /** 
   * 组件的方法列表 
   */
  methods: {
    //回退 
    _navBack: function () {
      wx.navigateBack({
        // delta: 1
      })
      // wx.navigateTo({
      //   url: '/pages/start/start'
      // })
      // wx.switchTab({ 
      //   url: '/pages/login/login' 
      // }) 
    }
  }
})