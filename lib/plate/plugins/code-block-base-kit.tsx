import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from '@platejs/code-block';
import { all, createLowlight } from 'lowlight';

import {
  CodeBlockElementStatic,
  CodeLineElementStatic,
  CodeSyntaxLeafStatic,
} from '@/lib/plate/ui/code-block-node-static';

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

export const BaseCodeBlockKit = [
  BaseCodeBlockPlugin.configure({
    node: { component: CodeBlockElementStatic },
    options: { lowlight },
  }),
  BaseCodeLinePlugin.withComponent(CodeLineElementStatic),
  BaseCodeSyntaxPlugin.withComponent(CodeSyntaxLeafStatic),
];
