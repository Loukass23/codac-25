import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '@/lib/plate/ui/link-node';
import { LinkFloatingToolbar } from '@/lib/plate/ui/link-toolbar';

export const LinkKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
];
