export default {
  async setUserInfo(context) {
    // userInfo模拟数据，真实开发环境中可以去掉，使用接口获取
    const data = {
      languageId: 'zh_CN',
      skin: 'redblack',
      breadcrumb: {
        '001': ['欢迎'],
        401: ['欢迎'],
      },
      code: [
        `${process.env.VUE_APP_CONTEXT}_001`,
        `${process.env.VUE_APP_CONTEXT}_002`,
        `${process.env.VUE_APP_CONTEXT}_401`,
      ],
    }
    // let { data } = await getUserInfo({ noMsg: true })
    context.commit('SET_USER_INFO', data, { root: true })
    return {
      userInfo: data,
    }
  },
}
