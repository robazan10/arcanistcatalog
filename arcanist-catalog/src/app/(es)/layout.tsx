import SiteLayout from '@/components/SiteLayout';
import { buildMetadata } from '@/lib/metadata';

export { viewport } from '@/lib/metadata';
export const metadata = buildMetadata('es');

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="es">{children}</SiteLayout>;
}
