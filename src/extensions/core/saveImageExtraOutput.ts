// @ts-strict-ignore
import { app } from '../../scripts/app'
import { applyTextReplacements } from '../../scripts/utils'

// Use widget values and dates in output filenames

app.registerExtension({
  name: 'Comfy.SaveImageExtraOutput',
  async beforeRegisterNodeDef(nodeType, nodeData, app) {
    if (
      nodeData.name === 'SaveImage' ||
      nodeData.name === 'SaveAnimatedWEBP' ||
      nodeData.name === 'SaveAnimatedWEBM'
    ) {
      const onNodeCreated = nodeType.prototype.onNodeCreated
      // When the SaveImage node is created we want to override the serialization of the output name widget to run our S&R
      nodeType.prototype.onNodeCreated = function () {
        const r = onNodeCreated
          ? onNodeCreated.apply(this, arguments)
          : undefined

        const widget = this.widgets.find((w) => w.name === 'filename_prefix')
        widget.serializeValue = () => {
          return applyTextReplacements(app, widget.value)
        }

        return r
      }
    } else {
      // When any other node is created add a property to alias the node
      const onNodeCreated = nodeType.prototype.onNodeCreated
      nodeType.prototype.onNodeCreated = function () {
        const r = onNodeCreated
          ? onNodeCreated.apply(this, arguments)
          : undefined

        if (!this.properties || !('Node name for S&R' in this.properties)) {
          this.addProperty('Node name for S&R', this.constructor.type, 'string')
        }

        return r
      }
    }
  }
})
