export function AboutUs() {
  return (
    <section id="about" className="py-16 bg-background text-foreground" data-testid="about-us">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Mission Statement */}
        <div className="text-center" data-testid="mission-section">
          <h2 className="text-3xl font-bold mb-4">Our Purpose</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We are built to make planning your dream trips simple, fun, and stress-free. 
            Explore the world, find destinations, and share your experiences.
          </p>
        </div>

        {/* Core Features */}
        <div className="text-center" data-testid="features-section">
          <h2 className="text-3xl font-bold mb-4">Core Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            - Build / Share custom itineraries on interactive maps! <br />
            - Browse pre-made routes for inspiration <br />
            - Use our unique search filters to find itineraries that match your budget and interests
          </p>
        </div>

        {/* Team */}
        <div className="text-center" data-testid="team-section">
          <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div data-testid="team-member-ethan">
              <p className="font-semibold">Ethan Jin (Class of 2025)</p>
              <p className="text-muted-foreground text-sm">
                Frontend / Backend, ensures everything is running nice and smooth
              </p>
            </div>
            <div data-testid="team-member-anthony">
              <p className="font-semibold">Anthony Sturrus (Class of 2025)</p>
              <p className="text-muted-foreground text-sm">
                Frontend/Backend work, passionate about user experience.
              </p>
            </div>
            <div data-testid="team-member-christian">
              <p className="font-semibold">Christian Barajas (Class of 2025)</p>
              <p className="text-muted-foreground text-sm">
              Frontend contributions, loves playing guitar and being a full time dad!
              </p>
            </div>
                        <div data-testid="team-member-christopher">
              <p className="font-semibold">Christopher Contreras (Class of 2025)</p>
              <p className="text-muted-foreground text-sm">
              From the Stock Predictor Team!
              </p>
            </div>
            <div data-testid="team-member-richard">
              <p className="font-semibold">Richard Nguyen (Class of 2025)</p>
              <p className="text-muted-foreground text-sm">
              From the Stock Predictor Team!
              </p>
            </div>
            <div data-testid="team-member-alex">
              <p className="font-semibold">Alex Martinez (Class of 2025)</p>
              <p className="text-muted-foreground text-sm">
              From the Stock Predictor Team!
              </p>
            </div>
            <div data-testid="team-member-rocco">
              <p className="font-semibold">Rocco Catalsan (Class of 2025)</p>
              <p className="text-muted-foreground text-sm">
              From the Stock Predictor Team!
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            Reach out via email or check out our GitHub repositories:
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="mailto:team@destinate.com" className="text-primary font-semibold" data-testid="email-link">
              Email
            </a>
            <a
              href="https://github.com/asturrus/Destinate"
              className="text-primary font-semibold"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="github-link"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
