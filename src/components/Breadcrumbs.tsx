import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
  className?: string;
}

const BASE_URL = "https://goruslugimsk.ru";

const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  // Build full breadcrumb list with "Главная" as first item
  const fullItems: BreadcrumbItemType[] = [
    { label: "Главная", href: "/" },
    ...items,
  ];

  // Generate Schema.org BreadcrumbList (SSR-safe)
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}${currentPath}`,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <Breadcrumb className={`hidden md:block ${className}`}>
        <BreadcrumbList>
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {!isLast && item.href ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.href} className="hover:text-primary transition-colors">
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default Breadcrumbs;
