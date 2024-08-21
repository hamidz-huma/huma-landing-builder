import React from 'react';

export const SectionComponent: React.FC = (props) => {
    return <section {...props} style={{ border: '1px solid black', padding: '20px' }}>
        <h1>HUMA</h1>
        <p>Paragraph</p>
    </section>;
};
