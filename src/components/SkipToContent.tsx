/**
 * Skip to content link for keyboard navigation
 * Improves accessibility by allowing keyboard users to skip navigation
 */
const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Перейти к содержимому
    </a>
  );
};

export default SkipToContent;
