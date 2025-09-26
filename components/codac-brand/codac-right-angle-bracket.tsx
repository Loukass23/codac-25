import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';

interface CodacRightAngleBracketProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '8xl';
  animated?: boolean;
}

const sizeConfig = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  '2xl': 'w-24 h-24',
  '8xl': 'w-96 h-96',
};

export const CodacRightAngleBracket: React.FC<CodacRightAngleBracketProps> = ({
  className,
  size = 'sm',
  animated = false,
}) => {
  const SvgComponent = (
    <svg
      viewBox="350 0 430 675"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeConfig[size], className)}
    >
      <g id="right-angle-bracket" className={animated ? 'animate-diamond-pulse' : ''} style={{ animationDelay: '1s' }}>
        <path
          d="M392.461 676.923L559.923 342.461L392.461 8L726.923 342.461L392.461 676.923Z"
          fill="url(#right-angle-gradient)"
        />
        <path
          d="M392.461 8L559.923 342.461L392.461 676.923M392.461 8L726.923 342.461L392.461 676.923"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <linearGradient
          id="right-angle-gradient"
          x1="250.5"
          y1="673.5"
          x2="268"
          y2="70.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E77096" />
          <stop offset="1" stopColor="#52EACE" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        {SvgComponent}
      </motion.div>
    );
  }

  return SvgComponent;
};

export default CodacRightAngleBracket;
