const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      <p className="text-muted-foreground text-sm">Загрузка...</p>
    </div>
  </div>
);

export default PageLoader;
