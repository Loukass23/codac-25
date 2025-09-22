import { cva } from 'class-variance-authority';

export const editorVariants = cva('group/editor', {
  defaultVariants: {
    variant: 'none',
  },
  variants: {
    disabled: {
      true: 'cursor-not-allowed opacity-50',
    },
    focused: {
      true: 'ring-2 ring-ring ring-offset-2',
    },
    variant: {
      project: 'w-full px-0 text-base md:text-sm',
      aiChat:
        'max-h-[min(70vh,320px)] w-full max-w-[700px] overflow-y-auto px-5 py-3 text-base md:text-sm',
      default:
        'size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]',
      demo: 'size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]',
      fullWidth: 'size-full px-16 pt-4 pb-72 text-base sm:px-24',
      none: '',
      select: 'px-3 py-2 text-base data-readonly:w-fit',
    },
  },
});
