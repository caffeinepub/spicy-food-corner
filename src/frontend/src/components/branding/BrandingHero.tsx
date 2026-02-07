export default function BrandingHero() {
  return (
    <section className="relative bg-gradient-to-br from-chart-1/10 via-chart-4/10 to-chart-5/10 overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-3 mb-6">
              <img
                src="/assets/generated/dailykart-logo.dim_512x512.png"
                alt="DailyKart"
                className="h-16 w-16 md:h-20 md:w-20 rounded-xl shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                DailyKart
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 mb-6">
              Delicious food and fresh groceries delivered to your doorstep. Order now on WhatsApp!
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur rounded-full border border-border">
                <span className="text-2xl">🌶️</span>
                <span className="text-sm font-medium">Spicy Delights</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur rounded-full border border-border">
                <span className="text-2xl">🛒</span>
                <span className="text-sm font-medium">Fresh Groceries</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur rounded-full border border-border">
                <span className="text-2xl">📱</span>
                <span className="text-sm font-medium">WhatsApp Orders</span>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <img
              src="/assets/generated/dailykart-hero.dim_1600x600.png"
              alt="DailyKart - Fresh Food and Groceries"
              className="w-full h-auto rounded-2xl shadow-2xl"
              onError={(e) => {
                e.currentTarget.src = '/assets/placeholder-product.svg';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
