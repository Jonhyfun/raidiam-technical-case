// https://on.cypress.io/api

describe('Data fetching', () => {
  it('loads under 10 seconds', () => {
    cy.visit('/')

    cy.contains('span', 'Loading...').should('be.visible')

    cy.contains('span', 'Loading...', { timeout: 10000 }).should('not.exist')
  })

  it('doesnt load again on route changes', () => {
    cy.visit('/')

    cy.get('a[href="/about"]').click()

    cy.contains('span', 'Loading...').should('not.exist')
  })
})
