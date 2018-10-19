import React from "react";
import { connect } from "react-redux";
import { Table, Th, Td, Button } from "./StyledElements";

class EmailDups extends React.Component {
  render() {

    const { loading, dups, attempted } = this.props;

    if (loading) {
      return <div>Loading Email Dups...</div>;
    }

    let tableContent;

    if(attempted && Object.keys(dups).length > 0){
      tableContent = Object.keys(dups).map(dup =>
                       <tr key={dup}>
                         <Td>{dup}</Td>
                         <Td>{dups[dup].toString()}</Td>
                       </tr>
                     )
    } else if(attempted && Object.keys(dups).length == 0){
      tableContent = <tr>
                       <Td>No Duplicates Found</Td>
                     </tr>
    }



    return (
      <div className='emailDups'>
        <div className='emailDupsButton'>
          <Button onClick={() => this.props.action(this.props.value)}>Find People Email Dups</Button>
        </div>
        <div className='emailDupsList'>
          { attempted &&
          <Table>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Possible Dups</Th>
              </tr>
            </thead>
            <tbody>
            { tableContent }
            </tbody>
          </Table>
        }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dups: state.peopleEmailDups.dups,
  loading: state.peopleEmailDups.loading,
  attempted: state.peopleEmailDups.attempted
});

export default connect(mapStateToProps)(EmailDups);
