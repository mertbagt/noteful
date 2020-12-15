import React from 'react'
import './CircleButton.css'

export default function NavCircleButton(props) {
  const { tag, className, childrenm, ...otherProps } = props

  return React.createElement(
    props.tag,
    {
      className: ['NavCircleButton', props.className].join(' '),
      ...otherProps
    },
    props.children
  )
}

NavCircleButton.defaultProps ={
  tag: 'a',
}


NavCircleButton.propTypes = {
  tag: (props, propName, componentName) => {
    const prop = props[propName];
    if(typeof prop != 'string' && typeof prop != 'function') {
      return new Error(`${propName} must be either a string or function. Validation failed.`)
    }
  }
}
