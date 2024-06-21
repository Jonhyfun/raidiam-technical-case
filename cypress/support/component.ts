// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import global styles
import '@/assets/main.css'
import VueApexCharts from 'vue3-apexcharts'

import { mount } from 'cypress/vue'

import { createPinia, setActivePinia } from 'pinia'

import { useDashboard } from '../../src/stores/dashboard'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from '../../src/router'

setActivePinia(
  createPinia()
)

const store = useDashboard()

Cypress.Commands.add('getDashboardStore', () => store)

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      getDashboardStore: () => ReturnType<typeof useDashboard>
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  options.global = options.global || {}
  options.global.plugins = options.global.plugins || []

  //// create router if one is not provided
  //if (!(options as any).router) {
  //  (options as any).router = createRouter({
  //    routes: routes.getRoutes(),
  //    history: createMemoryHistory(),
  //  })
  //}

  library.add(fas)

  // Add router plugin
  options.global.plugins.push({
    install(app) {
      app.use(router)
      app.use(VueApexCharts)
      app.component('font-awesome-icon', FontAwesomeIcon)
      app.use(createPinia())
    },
  })



  return mount(component, options)
})

// Example use:
// cy.mount(MyComponent)
