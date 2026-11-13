import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Venkatesh K — Technical Trainer | Software Engineer',
  description:
    'Software engineer and technical educator with enterprise backend experience at Oracle and 450+ hours of training delivered to 4,000+ students. Java, Spring Boot, 128-shard database architectures, and distributed systems.',
  authors: [{ name: 'Venkatesh K', url: 'https://github.com/VenkateshW22' }],
  keywords: [
    'Venkatesh K',
    'Software Engineer',
    'Technical Trainer',
    'Oracle',
    'Chandigarh University',
    'Spring Boot',
    'Microservices',
    'Database Sharding',
    'BullMQ',
    'Resilience4j',
    'Java Full Stack',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('vk_theme');
                  var theme = stored ? stored : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.dataset.theme = theme;
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
