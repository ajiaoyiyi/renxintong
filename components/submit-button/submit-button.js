Component({

  // 属性定义（详情参见下文）
  properties: {
    btnControl: { // 属性名
      type: Object,
      value: [],
      observer: function (newVal, oldVal) { // 属性被改变时执行的函数（可选）

      } 
    },
  },

   // 私有数据，可用于模板渲染
  data: {
    
  },
})