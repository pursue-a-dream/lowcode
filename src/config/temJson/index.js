const requireComponent = require.context('./', true, /\w+\.json$/)
let templateArr = []
requireComponent.keys().map(fileName => {
  let comp = requireComponent(fileName)
  templateArr.push(comp)
})
export default templateArr
