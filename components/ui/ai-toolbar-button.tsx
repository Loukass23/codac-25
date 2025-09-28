'use client';


import { AIChatPlugin } from '@platejs/ai/react';
import { useEditorPlugin } from 'platejs/react';
import * as React from 'react';

import { ToolbarButton } from './toolbar';

interface AIToolbarButtonProps extends React.ComponentProps<typeof ToolbarButton> {
  showText?: boolean;
}

export function AIToolbarButton({
  showText = true,
  children,
  ...props
}: AIToolbarButtonProps) {
  const { api } = useEditorPlugin(AIChatPlugin);

  return (
    <ToolbarButton
      {...props}
      onClick={() => {
        api.aiChat.show();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {children}
      {showText && (
        <span className="text-sm font-medium truncate">AI</span>
      )}
    </ToolbarButton>
  );
}
