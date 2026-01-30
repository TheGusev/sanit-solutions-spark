export interface District {
  id: string;
  name: string;
  slug: string;
  surcharge: number;
  metaTitle: string;
  metaDescription: string;
  fullName: string;
  center: [number, number];
  responseTime: string;
  neighborhoods: string[];
  popularObjects: Array<{ title: string; items: string[] }>;
  workedStreets: string[];
  faq: Array<{ question: string; answer: string }>;
}
