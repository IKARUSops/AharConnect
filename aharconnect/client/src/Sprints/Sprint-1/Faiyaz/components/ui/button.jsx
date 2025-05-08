import React from 'react';

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? 'span' : 'button';
  return (
    <Comp ref={ref} className={className} {...props} />
  );
});

export default Button;
