// https://on.cypress.io/api

describe('Data fetching', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  })

  it('shows all panels', () => {
    cy.visit('/demographic').then(() => {
      cy.get('aside.bg-emerald-100').should('have.length', 3);
    })
  })

  it('opens the filters modal', () => {
    cy.visit('/demographic').then(() => {
      cy.get('svg[class="svg-inline--fa fa-chart-line"]').click({ force: true })
      cy.get('div.fixed.inset-0').should('exist').find('div.w-96').should('exist')
    })
  })

  it('closes the filters modal by the button', () => {
    cy.visit('/demographic').then(() => {
      cy.get('svg[class="svg-inline--fa fa-chart-line"]').click({ force: true })
      cy.get('div.fixed.inset-0.z-50').should('exist').find('div.w-96').should('exist')
      cy.get('div.fixed.inset-0.z-50').find('div.w-96').find('button').first().click();

      cy.get('div.fixed.inset-0.z-50').should('not.exist')
    })
  })

  it('closes the filters modal by the background', () => {
    cy.visit('/demographic').then(() => {
      cy.get('svg[class="svg-inline--fa fa-chart-line"]').click({ force: true })
      cy.get('div.fixed.inset-0.z-50').should('exist').find('div.w-96').should('exist')

      cy.get('div.fixed.inset-0.z-50').click('topLeft')
      cy.get('div.fixed.inset-0.z-50').should('not.exist')
    })
  })
})
