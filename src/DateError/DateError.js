import React, { Component } from 'react';
import './DateError.css'

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
              <h2>Invalid Time Value</h2>
            );
        }
        return this.props.children;
    }
}

export default DateError;