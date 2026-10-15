import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Venkatesh K — Systems, made human.', description: 'Software engineer. Technical educator. Building resilient systems and the people behind them.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
