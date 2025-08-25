import { loadingPage, LOADING_STATE } from './tv.js'
import { navigate, swapFunctions } from 'astro:transitions/client'

const MIN_LOADING_TIME = 300

export function gotoPage(url) {
  if (!url || url.startsWith('#')) return
  navigate(url)
}

const htmlClassToPersist = ['webp', 'avif']

export function setupClientNavigation() {
  document.addEventListener('astro:before-preparation', (event) => {
    const navStart = performance.now()
    loadingPage.set(LOADING_STATE.Loading)

    // Wrap loader to enforce minimum time BEFORE swap so old content stays visible
    const originalLoader = event.loader
    event.loader = async () => {
      const start = navStart
      await originalLoader()
      const elapsed = performance.now() - start
      const remaining = MIN_LOADING_TIME - elapsed

      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining))
      }
    }
  })

  document.addEventListener('astro:before-swap', (event) => {
    const newDoc = event.newDocument
    if (!newDoc) return

    // Mirror native sequence except we don't replace the whole body element.
    event.swap = () => {
      //Mark new scripts that should not execute
      swapFunctions.deselectScripts(newDoc)

      // no need for swapping html attributes
      // swapFunctions.swapRootAttributes(newDoc)

      // essential for page-specific styles
      swapFunctions.swapHeadElements(newDoc)

      const restoreFocus = swapFunctions.saveFocus()

      const currentSwapContainer = document.querySelector(
        '[data-swap-container]'
      )
      const newSwapContainer = newDoc.querySelector('[data-swap-container]')
      // custom swap container to preserve css animations
      swapFunctions.swapBodyElement(newSwapContainer, currentSwapContainer)

      restoreFocus()
    }
  })

  document.addEventListener('astro:after-swap', () => {
    loadingPage.set(LOADING_STATE.Done)
  })
}
