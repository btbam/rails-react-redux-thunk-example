import React from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Table, Th, Td } from "./StyledElements";

import { fetchPeople, peopleEmailChars, peopleEmailDups } from "../actions/AsyncActions";
import EmailChars from "./EmailChars";
import EmailDups from "./EmailDups";

// console.log("In PeopleList Comp");

class PeopleList extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {isToggleOn: true};

  //   // This binding is necessary to make `this` work in the callback
  //   this.handleClick = this.handleClick.bind(this);
  // }

  componentDidMount() {
    this.props.dispatch(fetchPeople());
  }

  render() {
    
    const { error, loading, people } = this.props;

    if (error) {
      return <div>Error! {error.message}</div>;
    }

    if (loading) {
      return <div>Loading...</div>;
    }

    const email_char_action = bindActionCreators(peopleEmailChars, this.props.dispatch);
    const email_dups_action = bindActionCreators(peopleEmailDups, this.props.dispatch);

    return (
      <div>
        <EmailChars action={email_char_action} value={people} />
        <EmailDups action={email_dups_action} value={people} />
        <div id='people_list'>
          { people.length > 0 &&
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Title</Th>
                </tr>
              </thead>
              <tbody>
              { people.map(person =>
                <tr key={person.id}>
                  <Td>{person.attributes['first-name']} {person.attributes['last-name']}</Td>
                  <Td>{person.attributes['email-address']}</Td>
                  <Td>{person.attributes['title']}</Td>
                </tr>
              )}
              </tbody>
            </Table>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  people: state.people.people,
  loading: state.people.loading,
  error: state.people.error
});

export default connect(mapStateToProps)(PeopleList);
