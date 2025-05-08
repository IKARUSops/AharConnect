import React from 'react';

const Separator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));

export default Separator;
