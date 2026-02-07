export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About DailyKart
          </h1>
          <p className="text-lg text-muted-foreground">
            Your Local Online Ordering Platform
          </p>
        </div>

        {/* Overview Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Overview
          </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              DailyKart is a local online ordering platform that connects customers with nearby shopkeepers. 
              Our goal is to help people get their daily needs and food items quickly and easily.
            </p>
            <p className="font-medium text-foreground">
              DailyKart is not a direct seller of any products.
            </p>
            <p>
              Customer orders are forwarded to nearby shopkeepers, who handle packing and delivery. 
              This website operates under RKS Brand and provides a digital platform for local businesses.
            </p>
          </div>
        </section>

        {/* Service Area */}
        <section className="mb-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Service Area
          </h2>
          <p className="text-lg text-muted-foreground">
            📍 Vrindavan and nearby areas
          </p>
        </section>

        {/* Terms & Policy */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Terms & Policy
          </h2>

          <div className="space-y-6">
            {/* Order Policy */}
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Order Policy
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Customer orders are forwarded to nearby shopkeepers</li>
                <li>• Product availability depends on the shopkeeper</li>
              </ul>
            </div>

            {/* Payment Policy */}
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Payment Policy
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Payment is made directly to the shopkeeper</li>
                <li>• DailyKart does not handle any payments</li>
              </ul>
            </div>

            {/* Delivery Policy */}
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Delivery Policy
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Delivery is handled by the shopkeeper's delivery staff</li>
                <li>• Delivery time depends on distance and availability</li>
              </ul>
            </div>

            {/* Cancellation Policy */}
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Cancellation Policy
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Order cancellation after confirmation depends on shopkeeper approval</li>
              </ul>
            </div>

            {/* Responsibility */}
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Responsibility
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• DailyKart only connects customers and shopkeepers</li>
                <li>• Product quality, pricing, and delivery are the shopkeeper's responsibility</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Help Desk / Contact Us */}
        <section className="bg-primary/5 rounded-lg p-8 border border-primary/20">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Help Desk / Contact Us
          </h2>
          <p className="text-muted-foreground mb-6">
            If you need any help with your order or service, please contact us directly:
          </p>
          <div className="space-y-3 text-foreground">
            <div className="flex items-start">
              <span className="font-semibold min-w-[140px]">Mobile Number:</span>
              <a href="tel:9897743469" className="text-primary hover:underline">
                9897743469
              </a>
            </div>
            <div className="flex items-start">
              <span className="font-semibold min-w-[140px]">Owner Name:</span>
              <span>Ram Kumar Saini</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold min-w-[140px]">Brand Name:</span>
              <span>RKS Brand</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold min-w-[140px]">Address:</span>
              <span>Vrindavan, Rukmani Vihar, Sector-2</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
