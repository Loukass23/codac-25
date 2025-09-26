import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';

interface CodacLeftAngleBracketProps {
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

export const CodacLeftAngleBracket: React.FC<CodacLeftAngleBracketProps> = ({
  className,
  size = 'sm',
  animated = false,
}) => {
  const SvgComponent = (
    <svg
      viewBox="0 0 340 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeConfig[size], className)}
    >
      <g id="left-angle-bracket" className={animated ? 'animate-diamond-pulse' : ''}>
        <path
          d="M352.461 8L185 342.461L352.461 676.923L18 342.461L352.461 8Z"
          fill="url(#left-angle-gradient)"
        />
        <path
          d="M352.461 8L185 342.461L352.461 676.923M352.461 8L18 342.461L352.461 676.923"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <linearGradient
          id="left-angle-gradient"
          x1="310.5"
          y1="673.5"
          x2="328"
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
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        {SvgComponent}
      </motion.div>
    );
  }

  return SvgComponent;
};

export default CodacLeftAngleBracket;
