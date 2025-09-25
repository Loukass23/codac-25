'use client';

import { PlateController } from 'platejs/react';

export function DocumentEditorController({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlateController>{children}</PlateController>;
}
