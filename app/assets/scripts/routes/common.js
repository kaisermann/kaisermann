import nms from '../vendor/no-more-secrets'

export default {
  finalize () {
    window.requestAnimationFrame(() => {
      document.querySelectorAll('p:not(:first-child), ul, h2').forEach(el => {
        nms(el, {
          maxUpdateInterval: 45,
          minUpdateInterval: 10,
          maxUpdates: 3,
          extraDelay: 10,
          initialDelay: 900,
        })
      })
    })
  },
}
