import React from "react";
import { connect } from "react-redux";
import { Table, Th, Td, Button } from "./StyledElements";

class EmailChars extends React.Component {
  render() {

    const { loading, chars } = this.props;

    if (loading) {
      return <div>Loading Email Chars...</div>;
    }

    return (
      <div className='emailChars'>
        <div className='emailCharsButton'>
          <Button onClick={() => this.props.action(this.props.value)}>Find People Email Chars</Button>
        </div>
        <div className='emailCharsList'>
        { Object.keys(chars).length > 0 &&
          <Table>
            <thead>
              <tr>
                <Th>Character</Th>
                <Th>Count</Th>
              </tr>
            </thead>
            <tbody>
            {
              Object.keys(chars).sort(function(a,b){ return chars[b] - chars[a] } ).map(char =>
                <tr key={char}>
                  <Td>{char}</Td>
                  <Td>{chars[char]}</Td>
                </tr>
              )
            }
            </tbody>
          </Table>
        }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  chars: state.peopleEmailChars.chars,
  loading: state.peopleEmailChars.loading
});

export default connect(mapStateToProps)(EmailChars);
