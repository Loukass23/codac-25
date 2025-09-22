'use client';

import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from '@platejs/code-block/react';
import { all, createLowlight } from 'lowlight';

import {
  CodeBlockElement,
  CodeLineElement,
  CodeSyntaxLeaf,
} from '@/lib/plate/ui/code-block-node';

// Language mapping for unsupported languages
const languageMapping: Record<string, string> = {
  env: 'bash', // Map .env files to bash syntax
  dotenv: 'bash', // Alternative .env identifier
  properties: 'plaintext', // Java properties files
  ini: 'plaintext', // INI configuration files
};

// Create lowlight instance with language mapping
const lowlight = createLowlight(all);

// Override the highlight function to handle unsupported languages
const originalHighlight = lowlight.highlight;
lowlight.highlight = (language: string, value: string) => {
  const mappedLanguage = languageMapping[language] || language;

  try {
    return originalHighlight.call(lowlight, mappedLanguage, value);
  } catch (error) {
    // If the mapped language is also not supported, fallback to plaintext
    console.warn(
      `Language "${language}" is not registered. Falling back to plaintext.`
    );
    return originalHighlight.call(lowlight, 'plaintext', value);
  }
};

export const CodeBlockKit = [
  CodeBlockPlugin.configure({
    node: { component: CodeBlockElement },
    options: { lowlight },
    shortcuts: { toggle: { keys: 'mod+alt+8' } },
  }),
  CodeLinePlugin.withComponent(CodeLineElement),
  CodeSyntaxPlugin.withComponent(CodeSyntaxLeaf),
];
