interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  titleHighlight?: string;
}

const SectionHeading = ({
  label,
  title,
  subtitle,
  align = "center",
  className = "",
  titleHighlight,
}: SectionHeadingProps) => {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignClass} mb-8 md:mb-12 ${className}`}>
      {label && (
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-primary mb-2">
          {label}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
        {titleHighlight ? (
          <>
            {title} <span className="text-primary">{titleHighlight}</span>
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
      {/* Триколорная линия-подчёркивание */}
      <div className="tricolor-underline mt-4">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default SectionHeading;
