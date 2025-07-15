"use client";

import MarkdownSummary from "./mardown-summary";

const sampleMarkdown1 = `# Getting Started with Next.js

Next.js is a React framework that enables functionality such as server-side rendering and generating static websites.

## Installation

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Key Features

- **Server-side Rendering (SSR)**: Renders pages on the server
- **Static Site Generation (SSG)**: Pre-renders pages at build time
- **API Routes**: Build API endpoints within your Next.js app
- **File-based Routing**: Automatic routing based on file structure

> Next.js provides a great developer experience with features like Fast Refresh and built-in CSS support.

### Project Structure

\`\`\`
my-app/
├── pages/
│   ├── api/
│   ├── _app.js
│   └── index.js
├── public/
├── styles/
└── package.json
\`\`\`

For more information, visit the [official documentation](https://nextjs.org/docs).`;

export default function SummarySection() {
  return (
    <div className="flex flex-col gap-4">
      <MarkdownSummary
        title="Next.js Framework Guide"
        content={sampleMarkdown1}
        badge="Framework"
        defaultExpanded={true}
      />
      <MarkdownSummary
        title="Next.js Framework Guide"
        content={sampleMarkdown1}
        badge="Framework"
        defaultExpanded={true}
      />
    </div>
  );
}
