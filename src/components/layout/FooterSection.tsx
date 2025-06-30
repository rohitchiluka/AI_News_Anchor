import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  ArrowRight
} from 'lucide-react';

export function FooterSection() {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API Documentation', href: '#' },
      { name: 'Integrations', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Contact', href: '#contact' },
    ],
    resources: [
      { name: 'Blog', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Status', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-gradient-black-to-dark-blue border-t border-sci-gray-100">
      <div className="container-max">
        {/* Newsletter Section */}
        <div className="py-12 md:py-16 lg:py-20 border-b border-sci-gray-100 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h3 className="text-2xl md:text-3xl font-bold font-poppins gradient-text mb-3 md:mb-4">
              Stay Updated
            </h3>
            <p className="text-sci-light-gray mb-6 md:mb-8 text-sm md:text-base">
              Get the latest news about AI technology and platform updates delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 sci-input px-3 py-2 md:px-4 md:py-3 text-sm md:text-base"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="sci-button flex items-center justify-center space-x-2 text-sm md:text-base px-4 py-2 md:px-6 md:py-3"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4 md:space-y-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-cyan-to-blue rounded-full flex items-center justify-center shadow-glow-cyan">
                    <Zap className="w-4 h-4 md:w-6 md:h-6 text-sci-white" />
                  </div>
                  <span className="text-xl md:text-2xl font-bold font-poppins gradient-text">
                    Intellect
                  </span>
                </div>
                
                <p className="text-sci-light-gray leading-relaxed text-sm md:text-base">
                  Revolutionizing news consumption with AI-powered conversational interfaces. 
                  Experience the future of personalized news today.
                </p>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-sci-light-gray text-sm md:text-base">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 text-sci-cyan" />
                    <span>hello@intellect.ai</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sci-light-gray text-sm md:text-base">
                    <Phone className="w-3 h-3 md:w-4 md:h-4 text-sci-cyan" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sci-light-gray text-sm md:text-base">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-sci-cyan" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-3 md:space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 md:w-10 md:h-10 bg-sci-gray-200 hover:bg-gradient-cyan-to-blue rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-glow-cyan"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 md:w-5 md:h-5 text-sci-white" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div key={category}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="font-semibold text-sci-white mb-3 md:mb-4 capitalize text-sm md:text-base">
                    {category}
                  </h4>
                  <ul className="space-y-2">
                    {links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <button
                          onClick={() => link.href.startsWith('#') ? scrollToSection(link.href) : window.open(link.href)}
                          className="text-sci-light-gray hover:text-sci-cyan transition-colors duration-200 text-left text-sm md:text-base"
                        >
                          {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Bolt Logo Section - Moved above the border */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 border-b border-sci-gray-100">
          <div className="flex justify-center">
            <a
              href="https://bolt.new/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
              aria-label="Built with Bolt"
            >
              {/* Your Uploaded Bolt SVG Logo - No Effects */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16">
                <svg 
                  className="w-full h-full" 
                  viewBox="0.00 0.00 360.00 360.00" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g strokeWidth="2.00" fill="none" strokeLinecap="butt">
                    <path stroke="#808080" vectorEffect="non-scaling-stroke" d="
                      M 202.25 31.08
                      Q 207.24 29.82 207.15 24.69
                      C 207.08 20.58 203.76 18.04 199.96 17.46
                      Q 197.39 17.06 188.14 16.04
                      A 0.40 0.40 0.0 0 0 187.69 16.40
                      L 184.47 44.19
                      A 0.37 0.37 0.0 0 0 184.79 44.60
                      Q 193.62 45.81 198.47 46.05
                      C 206.73 46.46 210.30 35.46 202.19 31.67
                      A 0.32 0.32 0.0 0 1 202.25 31.08"
                    />
                    <path stroke="#808080" vectorEffect="non-scaling-stroke" d="
                      M 157.19 30.62
                      Q 157.05 30.64 156.85 30.38
                      Q 151.75 23.72 148.39 19.28
                      A 0.41 0.40 66.4 0 0 148.00 19.12
                      L 142.60 19.92
                      A 0.13 0.13 0.0 0 0 142.52 20.13
                      L 155.02 35.80
                      A 2.17 2.14 -69.3 0 1 155.46 36.80
                      L 156.87 46.27
                      A 0.67 0.67 0.0 0 0 157.62 46.83
                      Q 157.97 46.78 159.54 46.55
                      Q 161.11 46.32 161.46 46.26
                      A 0.67 0.67 0.0 0 0 162.02 45.51
                      L 160.63 36.04
                      A 2.17 2.14 52.5 0 1 160.77 34.95
                      L 168.21 16.34
                      A 0.13 0.13 0.0 0 0 168.07 16.16
                      L 162.67 16.96
                      A 0.41 0.40 -83.2 0 0 162.35 17.22
                      Q 160.41 22.44 157.45 30.29
                      Q 157.34 30.60 157.19 30.62"
                    />
                    <path stroke="#808080" vectorEffect="non-scaling-stroke" d="
                      M 230.3744 23.4791
                      A 14.98 13.44 -72.3 0 0 213.0162 33.6638
                      A 14.98 13.44 -72.3 0 0 221.2656 52.0209
                      A 14.98 13.44 -72.3 0 0 238.6238 41.8362
                      A 14.98 13.44 -72.3 0 0 230.3744 23.4791"
                    />
                    <path stroke="#808080" vectorEffect="non-scaling-stroke" d="
                      M 134.62 36.40
                      Q 138.57 33.09 136.25 28.51
                      C 134.39 24.84 130.29 24.00 126.62 25.13
                      Q 124.13 25.90 115.36 29.01
                      A 0.40 0.40 0.0 0 0 115.11 29.53
                      L 124.34 55.96
                      A 0.37 0.37 0.0 0 0 124.80 56.19
                      Q 133.28 53.43 137.75 51.53
                      C 145.37 48.29 143.78 36.83 134.83 36.96
                      A 0.32 0.32 0.0 0 1 134.62 36.40"
                    />
                    <path stroke="#808080" vectorEffect="non-scaling-stroke" d="
                      M 250.51 31.86
                      A 0.41 0.41 0.0 0 0 249.95 32.02
                      L 236.63 56.65
                      A 0.41 0.41 0.0 0 0 236.79 57.21
                      L 251.81 65.33
                      A 0.41 0.41 0.0 0 0 252.37 65.16
                      L 254.05 62.04
                      A 0.41 0.41 0.0 0 0 253.89 61.48
                      L 243.47 55.84
                      A 0.41 0.41 0.0 0 1 243.30 55.28
                      L 254.55 34.51
                      A 0.41 0.41 0.0 0 0 254.38 33.95
                      L 250.51 31.86"
                    />
                    <path stroke="#808080" vectorEffect="non-scaling-stroke" d="
                      M 77.14 52.81
                      L 92.62 75.33
                      A 0.76 0.76 0.0 0 0 93.67 75.52
                      L 101.89 69.88
                      A 13.35 13.03 55.5 0 0 105.07 51.49
                      L 103.85 49.73
                      A 13.35 13.03 55.5 0 0 85.55 46.11
                      L 77.34 51.75
                      A 0.76 0.76 0.0 0 0 77.14 52.81"
                    />
                    <path stroke="#808080" vectorEffect="non-scaling-stroke" d="
                      M 178.83 145.19
                      L 189.87 94.97
                      A 0.50 0.49 -83.8 0 0 189.39 94.37
                      L 150.39 94.37
                      A 0.46 0.45 -83.6 0 0 149.95 94.73
                      L 112.47 265.32
                      A 0.25 0.25 0.0 0 0 112.83 265.59
                      L 156.76 242.27
                      A 1.77 1.76 -7.6 0 0 157.66 241.10
                      L 159.73 231.67
                      A 0.34 0.34 0.0 0 1 160.32 231.52
                      Q 168.96 241.55 181.74 243.74
                      C 225.72 251.26 250.12 207.23 246.88 169.79
                      C 244.93 147.17 230.15 132.19 206.95 132.38
                      C 195.69 132.47 186.85 137.21 179.31 145.44
                      A 0.28 0.28 0.0 0 1 178.83 145.19"
                    />
                    <circle cx="278.44" cy="83.62" r="3.07" />
                    <circle cx="117.49" cy="302.82" r="3.08" />
                  </g>
                  
                  {/* White background circle */}
                  <path fill="#ffffff" d="
                    M 187.57 0.00
                    Q 199.38 0.96 203.49 1.51
                    C 284.35 12.35 347.69 75.59 358.50 156.51
                    Q 359.12 161.12 360.00 172.35
                    L 360.00 187.54
                    Q 359.51 192.86 359.05 198.17
                    Q 358.51 204.36 357.75 208.79
                    Q 346.10 276.38 294.21 319.22
                    Q 248.81 356.69 187.72 360.00
                    L 172.38 360.00
                    Q 120.29 356.91 79.84 329.58
                    Q 44.09 305.43 23.01 268.14
                    Q 2.48 231.81 0.00 187.66
                    L 0.00 172.39
                    Q 0.90 160.96 1.50 156.51
                    C 12.20 76.45 74.47 13.36 154.50 1.78
                    Q 160.62 0.89 172.33 0.00
                    L 187.57 0.00
                    Z"
                  />
                  
                  {/* Black content - clearly visible against white background */}
                  <path fill="#000000" d="
                    M 202.25 31.08
                    A 0.32 0.32 0.0 0 0 202.19 31.67
                    C 210.30 35.46 206.73 46.46 198.47 46.05
                    Q 193.62 45.81 184.79 44.60
                    A 0.37 0.37 0.0 0 1 184.47 44.19
                    L 187.69 16.40
                    A 0.40 0.40 0.0 0 1 188.14 16.04
                    Q 197.39 17.06 199.96 17.46
                    C 203.76 18.04 207.08 20.58 207.15 24.69
                    Q 207.24 29.82 202.25 31.08
                    Z"
                  />
                  <path fill="#000000" d="
                    M 159.54 46.55
                    Q 157.97 46.78 157.62 46.83
                    A 0.67 0.67 0.0 0 1 156.87 46.27
                    L 155.46 36.80
                    A 2.17 2.14 -69.3 0 0 155.02 35.80
                    L 142.52 20.13
                    A 0.13 0.13 0.0 0 1 142.60 19.92
                    L 148.00 19.12
                    A 0.41 0.40 66.4 0 1 148.39 19.28
                    Q 151.75 23.72 156.85 30.38
                    Q 157.05 30.64 157.19 30.62
                    Q 157.34 30.60 157.45 30.29
                    Q 160.41 22.44 162.35 17.22
                    A 0.41 0.40 -83.2 0 1 162.67 16.96
                    L 168.07 16.16
                    A 0.13 0.13 0.0 0 1 168.21 16.34
                    L 160.77 34.95
                    A 2.17 2.14 52.5 0 0 160.63 36.04
                    L 162.02 45.51
                    A 0.67 0.67 0.0 0 1 161.46 46.26
                    Q 161.11 46.32 159.54 46.55
                    Z"
                  />
                  <path fill="#000000" d="
                    M 230.3744 23.4791
                    A 14.98 13.44 -72.3 0 1 238.6238 41.8362
                    A 14.98 13.44 -72.3 0 1 221.2656 52.0209
                    A 14.98 13.44 -72.3 0 1 213.0162 33.6638
                    A 14.98 13.44 -72.3 0 1 230.3744 23.4791
                    Z"
                  />
                  <path fill="#000000" d="
                    M 134.83 36.96
                    C 143.78 36.83 145.37 48.29 137.75 51.53
                    Q 133.28 53.43 124.80 56.19
                    A 0.37 0.37 0.0 0 1 124.34 55.96
                    L 115.11 29.53
                    A 0.40 0.40 0.0 0 1 115.36 29.01
                    Q 124.13 25.90 126.62 25.13
                    C 130.29 24.00 134.39 24.84 136.25 28.51
                    Q 138.57 33.09 134.62 36.40
                    A 0.32 0.32 0.0 0 0 134.83 36.96
                    Z"
                  />
                  <path fill="#000000" d="
                    M 250.51 31.86
                    L 254.38 33.95
                    A 0.41 0.41 0.0 0 1 254.55 34.51
                    L 243.30 55.28
                    A 0.41 0.41 0.0 0 0 243.47 55.84
                    L 253.89 61.48
                    A 0.41 0.41 0.0 0 1 254.05 62.04
                    L 252.37 65.16
                    A 0.41 0.41 0.0 0 1 251.81 65.33
                    L 236.79 57.21
                    A 0.41 0.41 0.0 0 1 236.63 56.65
                    L 249.95 32.02
                    A 0.41 0.41 0.0 0 1 250.51 31.86
                    Z"
                  />
                  <path fill="#000000" d="
                    M 77.14 52.81
                    A 0.76 0.76 0.0 0 1 77.34 51.75
                    L 85.55 46.11
                    A 13.35 13.03 55.5 0 1 103.85 49.73
                    L 105.07 51.49
                    A 13.35 13.03 55.5 0 1 101.89 69.88
                    L 93.67 75.52
                    A 0.76 0.76 0.0 0 1 92.62 75.33
                    L 77.14 52.81
                    Z"
                  />
                  <path fill="#000000" d="
                    M 178.83 145.19
                    A 0.28 0.28 0.0 0 0 179.31 145.44
                    C 186.85 137.21 195.69 132.47 206.95 132.38
                    C 230.15 132.19 244.93 147.17 246.88 169.79
                    C 250.12 207.23 225.72 251.26 181.74 243.74
                    Q 168.96 241.55 160.32 231.52
                    A 0.34 0.34 0.0 0 0 159.73 231.67
                    L 157.66 241.10
                    A 1.77 1.76 -7.6 0 1 156.76 242.27
                    L 112.83 265.59
                    A 0.25 0.25 0.0 0 1 112.47 265.32
                    L 149.95 94.73
                    A 0.46 0.45 -83.6 0 1 150.39 94.37
                    L 189.39 94.37
                    A 0.50 0.49 -83.8 0 1 189.87 94.97
                    L 178.83 145.19
                    Z"
                  />
                  <circle fill="#000000" cx="278.44" cy="83.62" r="3.07"/>
                  <circle fill="#000000" cx="117.49" cy="302.82" r="3.08"/>
                </svg>
              </div>
            </a>
          </div>
          
          {/* Built with text */}
          <div className="text-center mt-3">
            <p className="text-xs sm:text-sm text-sci-light-gray/80 font-medium">
              Built with <span className="text-sci-cyan font-semibold">Bolt</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 md:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            <div className="text-sci-light-gray text-xs md:text-sm">
              © 2024 Intellect. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4 md:space-x-6 text-xs md:text-sm text-sci-light-gray">
              <span>Made with ❤️ for the future of news</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}