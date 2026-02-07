import { Heart } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p className="font-semibold text-foreground mb-1">Spicy Food Corner</p>
            <p>Your favorite food & grocery destination</p>
          </div>
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p className="flex items-center justify-center md:justify-end gap-1">
              © 2026. Built with{' '}
              <Heart className="h-4 w-4 text-chart-1 fill-chart-1" />{' '}
              using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
