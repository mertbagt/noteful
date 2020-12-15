import React, { Component } from 'react';

class DateError extends Component {
    constructor(props) {
        super(props);
        this.state = {
          hasError: false
        };
      }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {      
            return (
              <h3>Invalid Date</h3>
            );
        }
        return this.props.children;
    }
}

export default DateError;