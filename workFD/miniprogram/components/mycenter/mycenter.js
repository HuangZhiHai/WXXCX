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
      value: '#f4823e'
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
  }
}) 