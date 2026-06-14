import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[minmax(18rem, auto)] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group transition-all duration-300 shadow-sm border border-border/50 bg-card text-card-foreground flex flex-col p-5 hover:shadow-md hover:border-border/80 hover:translate-y-[-2px]",
        className
      )}
    >
      {header && <div className="mb-4">{header}</div>}
      <div className="flex-1 transition-transform duration-300">
        <div className="flex items-center space-x-2.5 mb-2">
          {icon}
          <div className="font-sans font-bold text-foreground">
            {title}
          </div>
        </div>
        <div className="font-sans font-normal text-muted-foreground text-sm">
          {description}
        </div>
      </div>
    </div>
  );
};
