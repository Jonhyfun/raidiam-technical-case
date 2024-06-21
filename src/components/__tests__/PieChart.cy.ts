import PieChart from "../charts/PieChart.vue"

describe('PieChart', () => {
  it('renders properly', () => {
    cy.mount(PieChart, {
      props: {
        data: {
          counts: [1, 2, 3, 4, 5, 6],
          entries: ['a', 'b', 'c', 'd', 'e', 'f']
        }
      }
    })

    cy.get('svg[class="apexcharts-svg"]').should('exist')
  })
})
