import { BaseSuggestionPlugin } from '@platejs/suggestion';

import { BaseSuggestionKit } from './suggestion-base-kit';

export const SuggestionKit = [...BaseSuggestionKit, BaseSuggestionPlugin];
