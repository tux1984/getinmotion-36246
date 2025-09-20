import React from 'react';

interface DescriptiveSectionProps {
  title: string;
  subtitle: string;
}

export const DescriptiveSection: React.FC<DescriptiveSectionProps> = ({
  title,
  subtitle
}) => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4 tracking-wide">
          {title}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
};