import React from 'react';

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input ref={ref} type={type} className={`input ${className}`} {...props} />
));

export default Input;
