import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venkatesh K — Technical Trainer & Software Engineer',
  description: 'Enterprise backend engineer (Oracle) and technical educator (Chandigarh University). Resilient microservices, 128-bucket database sharding, and interactive systems.',
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
