import { useEditorRef, usePluginOption } from 'platejs/react';

import { suggestionPlugin } from './suggestion-kit';

function SuggestionToolbar() {
    const editor = useEditorRef();
    const isSuggesting = usePluginOption(suggestionPlugin, 'isSuggesting');

    const toggleSuggesting = () => {
        editor.setOption(suggestionPlugin, 'isSuggesting', !isSuggesting);
    };

    return (
        <button onClick={toggleSuggesting}>
            {isSuggesting ? 'Stop Suggesting' : 'Start Suggesting'}
        </button>
    );
}

export default SuggestionToolbar;