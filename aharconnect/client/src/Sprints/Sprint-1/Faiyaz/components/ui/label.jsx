import React from 'react';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={className} {...props} />
));

export default Label;
