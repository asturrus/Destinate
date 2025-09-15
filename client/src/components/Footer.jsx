import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Documentation", href: "#docs" },
      { name: "API", href: "#api" }
    ],
    company: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" }
    ],
    resources: [
      { name: "Community", href: "#community" },
      { name: "Help Center", href: "#help" },
      { name: "Status", href: "#status" },
      { name: "Security", href: "#security" }
    ]
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4" data-testid="text-footer-logo">
              Destinate
            </h3>
            <p className="text-muted-foreground mb-6" data-testid="text-footer-description">
              Planning your trip has never been easier. Set up your itinerary with today!
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover-elevate"
                  data-testid={`button-social-${social.label.toLowerCase()}`}
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-footer-product-title">
              Product
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-product-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-footer-company-title">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-company-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-footer-resources-title">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-resources-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground" data-testid="text-footer-copyright">
              © 2024 Destinate. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                Privacy Policy
              </a>
              <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-terms">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}