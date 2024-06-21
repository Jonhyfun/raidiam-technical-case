import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import Sidebar from "../layout/Sidebar/index.vue"

describe('Sidebar', () => {
  beforeEach(() => {
    cy.mount(Sidebar, {
      props: {
        options: {
          Group: {
            groupIcon: {
              iconComponent: FontAwesomeIcon,
              iconProps: { icon: ['fas', 'user-group'] }
            },
            groupOptions: [
              {
                label: 'First Tab',
                icon: {
                  iconComponent: FontAwesomeIcon,
                  iconProps: { icon: ['fas', 'earth-americas'] }
                },
                src: '/demographic'
              },
              {
                label: 'Second Tab',
                icon: {
                  iconComponent: FontAwesomeIcon,
                  iconProps: { icon: ['fas', 'lock'] }
                },
                src: '/authorization?threshold=2'
              }
            ]
          }
        }
      }
    })
  })

  it('renders properly with an <ul> with exactly two <li> elements', () => {
    cy.get('ul').should('have.length', 1);
    cy.get('ul > li').should('have.length', 2);
    cy.get('ul > li')
  })

  it('the sidebar elements should be active based on route', () => {
    cy.contains('h2', 'First Tab').should('have.class', 'text-emerald-600');
    cy.contains('h2', 'Second Tab').click()

    cy.contains('h2', 'First Tab').should('not.have.class', 'text-emerald-600');
    cy.contains('h2', 'Second Tab').should('have.class', 'text-emerald-600');
  });

  it('hides the elements when a group is clicked', () => {
    cy.contains('h2', 'Group').click()
    cy.get('ul').should('not.exist');
  })

  it('toggles when the arrow is clicked', () => {
    cy.get('aside').should('have.css', 'width', '208px')
    cy.get('svg.fa-arrow-right-from-bracket').click()

    cy.get('aside').should('have.css', 'width', '80px')

    cy.get('svg.fa-arrow-right-from-bracket').click()
    cy.get('aside').should('have.css', 'width', '208px')
  })
})
