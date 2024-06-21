import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Sidebar from '../layout/Sidebar/index.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    cy.mount(Sidebar, {
      props: {
        options: {
          Dashboard: {
            groupIcon: {
              iconComponent: FontAwesomeIcon,
              iconProps: { icon: ['fas', 'chart-pie'] }
            },
            groupOptions: [
              {
                label: 'Demographic',
                icon: {
                  iconComponent: FontAwesomeIcon,
                  iconProps: { icon: ['fas', 'earth-americas'] }
                },
                src: '/demographic'
              }
            ]
          }
        }
      }
    })

    cy.get('h2').should('contain', 'Dashboard')
  })
})
