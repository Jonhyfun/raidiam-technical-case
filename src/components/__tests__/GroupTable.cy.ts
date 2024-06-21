import { mount } from 'cypress/vue';
import GroupTable from '../Table/GroupTable.vue';

const groupData = [
  {
    svgUrl: 'https://www.svgrepo.com/show/532033/cloud.svg',
    label: 'Label 1',
    key: 'key1',
    someUrl: 'https://example.com',
    someText: 'Some text',
  },
  {
    svgUrl: 'https://www.svgrepo.com/show/532033/cloud.svg',
    label: 'Label 2',
    key: 'key2',
    someUrl: 'https://example2.com',
    someText: 'Some more text',
  }
];

const groupOptions = {
  svgProp: 'svgUrl',
  labelProp: 'label',
  keyProp: 'key'
};

const groupOptionLabels = {
  svgUrl: 'SVG URL',
  label: 'Label',
  key: 'Key',
  someUrl: 'Some URL',
  someText: 'Some Text'
};

const groupOptionFormatters = {
  someText: (text: string) => text.toUpperCase()
};

describe('MyComponent', () => {
  it('should render the component allow a group to be opened and to return to the list', () => {
    mount(GroupTable, {
      props: {
        groupData,
        groupOptions,
        groupOptionLabels,
        groupOptionFormatters,
      },
    });

    cy.get('ol li').should('have.length', groupData.length);

    cy.get('ol li').first().click();

    cy.get('.flex-col .rounded-md').should('exist');
    cy.get('h4').contains(groupData[0].label);

    cy.get('font-awesome-icon[icon="fa-solid fa-arrow-left"]').click({ force: true });

    cy.get('ol li').should('have.length', groupData.length);
  });

  it('should handle pagination', () => {
    mount(GroupTable, {
      props: {
        groupData: [...groupData, ...groupData, ...groupData, ...groupData, ...groupData],
        groupOptions,
        groupOptionLabels,
        groupOptionFormatters,
      },
    });

    cy.get('ol li').should('have.length', 10);
  });
});