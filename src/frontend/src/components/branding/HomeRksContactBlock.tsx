export default function HomeRksContactBlock() {
  return (
    <section className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {/* Brand Name */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Brand Name
              </h3>
              <p className="text-lg font-bold text-foreground">RKS</p>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Address
              </h3>
              <p className="text-base text-foreground">
                Vrindavan, Rukmani Vihar, Sector-2
              </p>
            </div>

            {/* Contact Number */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Contact Number
              </h3>
              <a
                href="tel:9897743469"
                className="text-lg font-bold text-primary hover:underline block"
              >
                9897743469
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
