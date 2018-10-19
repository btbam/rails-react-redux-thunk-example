import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'

import PeopleList from '../../client/src/components/PeopleList';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const mockPerson = { id: 1, attributes: { 'first-name': 'John', 'last-name': 'Doe', 'email-address': 'jdoe@example.com', title: 'Job Title' } }
const initialState = {
  people:
    {
      error: null,
      loading: false,
      people: [ mockPerson ]
    }
};
const store = mockStore(initialState);

fetchMock.getOnce('/api/my_people.json', { body: { data: [ { 'foo': 'bar' }] }, headers: { 'content-type': 'application/json' } })

describe('<PeopleList />', () => {
  describe('render()', () => {
    test('renders the component', () => {
      const wrapper = shallow(<PeopleList store={store} />);
      const component = wrapper.dive();

      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
