// 防抖函数
export function throttle(fn, wait = 5000) {
  let timer
  return function () {
    if (timer != null) return
    let args = arguments
    let that = this
    fn.apply(that, args)
    timer = setTimeout(() => {
      timer = null
    }, wait)
  }
}
export function isNull(value) {
  return value === null || value === undefined
}

export function isNotNull(value) {
  return value !== null && value !== undefined
}

export function isEmptyStr(str) {
  //return (str === undefined) || (!str) || (!/[^\s]/.test(str));
  return str === undefined || (!str && str !== 0 && str !== '0') || !/[^\s]/.test(str)
}

export const generateId = function (type = '') {
  let num = Math.floor(Math.random() * 10000000) + ''
  return type + num.slice(num.length - 5)
}

export const deepClone = function (obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  if (cache.has(obj)) return cache.get(obj) // 如果出现循环引用，则返回缓存的对象，防止递归进入死循环
  let cloneObj = new obj.constructor() // 使用对象所属的构造函数创建一个新对象
  cache.set(obj, cloneObj) // 缓存对象，用于循环引用的情况

  for (let key in obj) {
    // if (obj.hasOwnProperty(key)) {
    cloneObj[key] = deepClone(obj[key], cache) // 递归拷贝
    // }
  }
  return cloneObj
}

export const overwriteObj = function (obj1, obj2) {
  /* 浅拷贝对象属性，obj2覆盖obj1 */
  // for (let prop in obj2) {
  //   if (obj2.hasOwnProperty(prop)) {
  //     obj1[prop] = obj2[prop]
  //   }
  // }

  Object.keys(obj2).forEach(prop => {
    obj1[prop] = obj2[prop]
  })
}

export const addWindowResizeHandler = function (handler) {
  let oldHandler = window.onresize
  if (typeof window.onresize != 'function') {
    window.onresize = handler
  } else {
    window.onresize = function () {
      oldHandler()
      handler()
    }
  }
}

export const insertCustomCssToHead = function (cssCode, formId = '') {
  let head = document.getElementsByTagName('head')[0]
  let oldStyle = document.getElementById('vform-custom-css')
  if (oldStyle) {
    head.removeChild(oldStyle) //先清除后插入！！
  }
  if (formId) {
    oldStyle = document.getElementById('vform-custom-css' + '-' + formId)
    !!oldStyle && head.removeChild(oldStyle) //先清除后插入！！
  }

  let newStyle = document.createElement('style')
  newStyle.type = 'text/css'
  newStyle.rel = 'stylesheet'
  newStyle.id = formId ? 'vform-custom-css' + '-' + formId : 'vform-custom-css'
  try {
    newStyle.appendChild(document.createTextNode(cssCode))
  } catch (ex) {
    newStyle.styleSheet.cssText = cssCode
  }

  head.appendChild(newStyle)
}

export const insertGlobalFunctionsToHtml = function (functionsCode, formId = '') {
  let bodyEle = document.getElementsByTagName('body')[0]
  let oldScriptEle = document.getElementById('v_form_global_functions')
  !!oldScriptEle && bodyEle.removeChild(oldScriptEle) //先清除后插入！！
  if (formId) {
    oldScriptEle = document.getElementById('v_form_global_functions' + '-' + formId)
    !!oldScriptEle && bodyEle.removeChild(oldScriptEle) //先清除后插入！！
  }

  let newScriptEle = document.createElement('script')
  newScriptEle.id = formId ? 'v_form_global_functions' + '-' + formId : 'v_form_global_functions'
  newScriptEle.type = 'text/javascript'
  newScriptEle.innerHTML = functionsCode
  bodyEle.appendChild(newScriptEle)
}

export const optionExists = function (optionsObj, optionName) {
  if (!optionsObj) {
    return false
  }

  return Object.keys(optionsObj).indexOf(optionName) > -1
}

export const loadRemoteScript = function (srcPath, callback) {
  /*加载远程js，加载成功后执行回调函数*/
  let sid = encodeURIComponent(srcPath)
  let oldScriptEle = document.getElementById(sid)

  if (!oldScriptEle) {
    let s = document.createElement('script')
    s.src = srcPath
    s.id = sid
    document.body.appendChild(s)

    s.onload = s.onreadystatechange = function (_, isAbort) {
      /* 借鉴自ace.js */
      if (isAbort || !s.readyState || s.readyState === 'loaded' || s.readyState === 'complete') {
        s = s.onload = s.onreadystatechange = null
        if (!isAbort) {
          callback()
        }
      }
    }
  }
}

export function traverseFieldWidgets(widgetList, handler, parent = null) {
  widgetList.forEach(w => {
    if (w.formItemFlag) {
      handler(w, parent)
    } else if (w.type === 'grid') {
      w.cols.forEach(col => {
        traverseFieldWidgets(col.widgetList, handler, w)
      })
    } else if (w.type === 'table') {
      w.rows.forEach(row => {
        row.cols.forEach(cell => {
          traverseFieldWidgets(cell.widgetList, handler, w)
        })
      })
    } else if (w.type === 'tab') {
      w.tabs.forEach(tab => {
        traverseFieldWidgets(tab.widgetList, handler, w)
      })
    } else if (w.type === 'sub-form') {
      traverseFieldWidgets(w.widgetList, handler, w)
    } else if (w.category === 'container') {
      //自定义容器
      traverseFieldWidgets(w.widgetList, handler, w)
    }
  })
}

export function traverseContainWidgets(widgetList, handler) {
  widgetList.forEach(w => {
    if (w.category === 'container') {
      handler(w)
    }

    if (w.type === 'grid') {
      w.cols.forEach(col => {
        traverseContainWidgets(col.widgetList, handler)
      })
    } else if (w.type === 'table') {
      w.rows.forEach(row => {
        row.cols.forEach(cell => {
          traverseContainWidgets(cell.widgetList, handler)
        })
      })
    } else if (w.type === 'tab') {
      w.tabs.forEach(tab => {
        traverseContainWidgets(tab.widgetList, handler)
      })
    } else if (w.type === 'sub-form') {
      traverseContainWidgets(w.widgetList, handler)
    } else if (w.category === 'container') {
      //自定义容器
      traverseContainWidgets(w.widgetList, handler)
    }
  })
}

export function traverseAllWidgets(widgetList, handler) {
  widgetList.forEach(w => {
    handler(w)

    if (w.type === 'grid') {
      w.cols.forEach(col => {
        handler(col)
        traverseAllWidgets(col.widgetList, handler)
      })
    } else if (w.type === 'table') {
      w.rows.forEach(row => {
        row.cols.forEach(cell => {
          handler(cell)
          traverseAllWidgets(cell.widgetList, handler)
        })
      })
    } else if (w.type === 'tab') {
      w.tabs.forEach(tab => {
        traverseAllWidgets(tab.widgetList, handler)
      })
    } else if (w.type === 'sub-form') {
      traverseAllWidgets(w.widgetList, handler)
    } else if (w.category === 'container') {
      //自定义容器
      traverseAllWidgets(w.widgetList, handler)
    }
  })
}

function handleWidgetForTraverse(widget, handler) {
  if (widget.category) {
    traverseFieldWidgetsOfContainer(widget, handler)
  } else if (widget.formItemFlag) {
    handler(widget)
  }
}

/**
 * 遍历容器内的字段组件
 * @param con
 * @param handler
 */
export function traverseFieldWidgetsOfContainer(con, handler) {
  if (con.type === 'grid') {
    con.cols.forEach(col => {
      col.widgetList.forEach(cw => {
        handleWidgetForTraverse(cw, handler)
      })
    })
  } else if (con.type === 'table') {
    con.rows.forEach(row => {
      row.cols.forEach(cell => {
        cell.widgetList.forEach(cw => {
          handleWidgetForTraverse(cw, handler)
        })
      })
    })
  } else if (con.type === 'tab') {
    con.tabs.forEach(tab => {
      tab.widgetList.forEach(cw => {
        handleWidgetForTraverse(cw, handler)
      })
    })
  } else if (con.type === 'sub-form') {
    con.widgetList.forEach(cw => {
      handleWidgetForTraverse(cw, handler)
    })
  } else if (con.category === 'container') {
    //自定义容器
    con.widgetList.forEach(cw => {
      handleWidgetForTraverse(cw, handler)
    })
  }
}

/**
 * 获取所有字段组件
 * @param widgetList
 * @returns {[]}
 */
export function getAllFieldWidgets(widgetList) {
  let result = []
  let handlerFn = w => {
    result.push({
      type: w.type,
      name: w.options.name,
      field: w,
    })
  }
  traverseFieldWidgets(widgetList, handlerFn)

  return result
}

/**
 * 获取所有容器组件
 * @param widgetList
 * @returns {[]}
 */
export function getAllContainerWidgets(widgetList) {
  let result = []
  let handlerFn = w => {
    result.push({
      type: w.type,
      name: w.options.name,
      container: w,
    })
  }
  traverseContainWidgets(widgetList, handlerFn)

  return result
}

export function getQueryParam(variable) {
  let query = window.location.search.substring(1)
  let vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }

  return undefined
}

export function getDefaultFormConfig() {
  return {
    modelName: 'formData',
    refName: 'vForm',
    rulesName: 'rules',
    labelWidth: 80,
    labelPosition: 'left',
    size: '',
    labelAlign: 'label-left-align',
    cssCode: '',
    customClass: '',
    functions: '',
    layoutType: 'PC',

    onFormCreated: '',
    onFormMounted: '',
    onFormDataChange: '',
  }
}

export function buildDefaultFormJson() {
  return {
    widgetList: [],
    formConfig: deepClone(getDefaultFormConfig()),
  }
}
// 时间戳或日期对象 转 字符串
export const timeToString = obj => {
  if (!obj) {
    return {}
  }
  if (!obj.getDate) {
    // 不是日期对象，默认是时间戳，转为日期对象
    obj = new Date(parseInt(obj))
  }
  const LocaleDateString = obj
    .toLocaleDateString()
    .split('/')
    .map(item => (item.length < 2 ? `0${item}` : item))
    .join('/')
  const hour = obj.getHours().toString()
  const minute = obj.getMinutes().toString()
  const second = obj.getSeconds().toString()

  const hours = hour.length < 2 ? `0${hour}` : hour
  const minutes = minute.length < 2 ? `0${minute}` : minute
  const seconds = second.length < 2 ? `0${second}` : second

  const LocaleTimeString = `${hours}:${minutes}:${seconds}`
  return {
    localeString: `${LocaleDateString} ${LocaleTimeString}`,
    timeString: LocaleTimeString,
  }
}
// 将对象转换成字符串
export const transObjToStr = function (obj, cache = new WeakMap()) {
  const newObj = deepClone(obj)
  const mapObj = obj => {
    if (obj != null && typeof obj === 'object') {
      for (let key in obj) {
        obj[key] = typeof obj[key] === 'function' ? obj[key].toString() : mapObj(obj[key])
      }
    }
    return obj
  }
  mapObj(newObj)
  return JSON.stringify(newObj)
}
// 将函数字符串转换成函数
export const transStrFnToFn = function (obj) {
  const isFnstr = str => {
    return typeof str === 'string' && str.indexOf('=>') > 0
  }
  const newObj = Object.assign(Array.isArray(obj) ? [] : {}, obj)
  const mapObj = obj => {
    if (obj != null && typeof obj === 'object') {
      for (let key in obj) {
        obj[key] = isFnstr(obj[key]) ? eval(obj[key]) : mapObj(obj[key])
      }
    }
    return obj
  }
  mapObj(newObj)
  return newObj
}
