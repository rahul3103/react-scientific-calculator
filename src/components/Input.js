import React from 'react';

class Input extends React.Component {
  render() {
    return (
      <div className={"screen-row-input"}>
        {this.props.children} {/* this is the value passed from the button*/}
      </div>
    );
  }
}

export default Input;