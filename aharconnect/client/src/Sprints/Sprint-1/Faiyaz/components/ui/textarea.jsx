import React from 'react';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref} className={className} {...props} />
));

export default Textarea;
