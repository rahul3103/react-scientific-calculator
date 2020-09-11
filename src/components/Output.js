import React from 'react';

class Output extends React.Component {
  render() {
    return (
      <div className={"screen-row-output"}>
        {this.props.children} {/* this is the value passed from the button*/}
      </div>
    )
  }
}

export default Output;