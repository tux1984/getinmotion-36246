import React from 'react';

const applyInlineFormatting = (text: string, keyPrefix: string): (string | JSX.Element)[] => {
    // This regex will split the string by **bold** or _italic_ parts, keeping the delimiters.
    const parts = text.split(/(\*\*.*?\*\*|_.*?_)/g).filter(part => part); // filter out empty strings
    
    return parts.map((part, index) => {
        const key = `${keyPrefix}-${index}`;
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={key} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('_') && part.endsWith('_')) {
            return <em key={key} className="italic">{part.slice(1, -1)}</em>;
        }
        return part; // Return as plain text if no formatting matches
    });
};

export const RichTextRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Split content into lines to process each one for block-level elements like headings.
    const lines = content.split('\n');

    return (
        <div className="text-white/90 leading-relaxed">
            {lines.map((line, index) => {
                const key = `line-${index}`;
                if (line.startsWith('#### ')) {
                    return <h4 key={key} className="text-base font-semibold mt-2 mb-1">{applyInlineFormatting(line.substring(5), key)}</h4>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={key} className="text-lg font-semibold mt-3 mb-1">{applyInlineFormatting(line.substring(4), key)}</h3>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={key} className="text-xl font-bold mt-4 mb-2">{applyInlineFormatting(line.substring(3), key)}</h2>;
                }
                if (line.startsWith('# ')) {
                    return <h1 key={key} className="text-2xl font-bold mt-4 mb-2">{applyInlineFormatting(line.substring(2), key)}</h1>;
                }
                if (line.trim() === '') {
                    // Using a div for a more consistent break than <br>
                    return <div key={key} className="h-4" />;
                }
                
                return <p key={key} className="my-0.5">{applyInlineFormatting(line, key)}</p>;
            })}
        </div>
    );
};
