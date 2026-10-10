import SiteLayout from '@/components/SiteLayout';
import { buildMetadata } from '@/lib/metadata';

export { viewport } from '@/lib/metadata';
export const metadata = buildMetadata('en');

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="en">{children}</SiteLayout>;
}
