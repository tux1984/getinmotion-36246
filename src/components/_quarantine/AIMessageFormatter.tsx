import React from 'react';

interface AIMessageFormatterProps {
  content: string;
  className?: string;
}

export const AIMessageFormatter: React.FC<AIMessageFormatterProps> = ({ 
  content, 
  className = '' 
}) => {
  const formatContent = (text: string) => {
    // Convert HTML-like content to React elements
    let formattedText = text;
    
    // Handle lists
    formattedText = formattedText.replace(
      /<li>(.*?)<\/li>/g, 
      '• $1\n'
    );
    
    // Remove ul tags
    formattedText = formattedText.replace(/<\/?ul>/g, '');
    
    // Handle paragraphs
    formattedText = formattedText.replace(
      /<p>(.*?)<\/p>/g, 
      '$1\n\n'
    );
    
    // Handle strong/bold text with markdown-style formatting
    formattedText = formattedText.replace(
      /<strong>(.*?)<\/strong>/g, 
      '**$1**'
    );
    
    // Clean up extra newlines
    formattedText = formattedText.replace(/\n{3,}/g, '\n\n');
    formattedText = formattedText.trim();
    
    return formattedText;
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const formattedContent = formatContent(content);
  
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <div className="whitespace-pre-line text-sm leading-relaxed">
        {renderFormattedText(formattedContent)}
      </div>
    </div>
  );
};