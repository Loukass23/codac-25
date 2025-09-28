'use client';

import React, { useState } from 'react';
import { MorphingBracket } from './morphing-bracket';

export const MorphingDemo: React.FC = () => {
    const [morphType, setMorphType] = useState<'diamond' | 'angle-bracket' | 'circle' | 'square'>('diamond');
    const [autoMorph, setAutoMorph] = useState(false);

    return (
        <div className="flex flex-col items-center space-y-8 p-8">
            <h2 className="text-2xl font-bold text-center">Morphing Bracket Animation</h2>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
                <button
                    onClick={() => setMorphType('diamond')}
                    className={`px-4 py-2 rounded ${morphType === 'diamond' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Diamond
                </button>
                <button
                    onClick={() => setMorphType('angle-bracket')}
                    className={`px-4 py-2 rounded ${morphType === 'angle-bracket' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Angle Bracket
                </button>
                <button
                    onClick={() => setMorphType('circle')}
                    className={`px-4 py-2 rounded ${morphType === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Circle
                </button>
                <button
                    onClick={() => setMorphType('square')}
                    className={`px-4 py-2 rounded ${morphType === 'square' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Square
                </button>
            </div>

            {/* Auto morph toggle */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="autoMorph"
                    checked={autoMorph}
                    onChange={(e) => setAutoMorph(e.target.checked)}
                    className="w-4 h-4"
                />
                <label htmlFor="autoMorph" className="text-sm">
                    Auto morph between shapes
                </label>
            </div>

            {/* Morphing brackets */}
            <div className="flex items-center space-x-8">
                <MorphingBracket
                    direction="left"
                    morphType={morphType}
                    autoMorph={autoMorph}
                    size="xl"
                    morphDuration={1.5}
                />
                <MorphingBracket
                    direction="right"
                    morphType={morphType}
                    autoMorph={autoMorph}
                    size="xl"
                    morphDuration={1.5}
                />
            </div>

            {/* Different sizes demo */}
            <div className="flex items-center space-x-4">
                <MorphingBracket
                    direction="left"
                    morphType={morphType}
                    size="sm"
                />
                <MorphingBracket
                    direction="left"
                    morphType={morphType}
                    size="md"
                />
                <MorphingBracket
                    direction="left"
                    morphType={morphType}
                    size="lg"
                />
                <MorphingBracket
                    direction="left"
                    morphType={morphType}
                    size="xl"
                />
            </div>
        </div>
    );
};

export default MorphingDemo;
