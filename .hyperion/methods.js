// Add nunjuck custom methods here
module.exports = {
  asset (assetPath) {
    return `${this.ctx.app.urls.assets}/${assetPath}`
  },
}
