'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
          router.push('/dashboard');
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Eco Green</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Services</a>
              <a href="#products" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Products</a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login?mode=login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link href="/login?mode=register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Sustainable Supply Chain Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Your trusted platform for eco-friendly products and sustainable business practices. 
              Join our community of environmentally conscious businesses and make a difference.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/login?mode=register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link href="#services" className="btn btn-secondary btn-lg">
                Learn More
              </Link>
            </div>
            <div className="mt-8 flex items-center space-x-8">
              <div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">500+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">100+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Partners</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">24/7</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Support</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 p-8 shadow-2xl">
              <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-9xl">🌍</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4 py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl my-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive solutions for sustainable supply chain management
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📦</div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Product Sourcing
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Access to verified eco-friendly products from trusted suppliers worldwide
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>✓ Quality assurance</li>
              <li>✓ Competitive pricing</li>
              <li>✓ Fast delivery</li>
            </ul>
          </div>
          <div className="card hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔄</div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Order Management
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Streamlined order processing with real-time tracking and updates
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>✓ Real-time tracking</li>
              <li>✓ Automated workflows</li>
              <li>✓ Payment verification</li>
            </ul>
          </div>
          <div className="card hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics & Reports
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Comprehensive insights into your supply chain performance
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>✓ Detailed analytics</li>
              <li>✓ Custom reports</li>
              <li>✓ Performance metrics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section id="products" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our range of sustainable products
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: '🏗️', name: 'Construction Materials', desc: 'Steel, cement, and more' },
            { icon: '⚡', name: 'Electronics', desc: 'Cables and components' },
            { icon: '🎨', name: 'Chemicals', desc: 'Paints and coatings' },
            { icon: '🪵', name: 'Wood Products', desc: 'Plywood and timber' },
          ].map((product, idx) => (
            <div key={idx} className="card text-center hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl mb-3">{product.icon}</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{product.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/login?mode=register" className="btn btn-primary">
            View All Products
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl my-12">
        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose Eco Green?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              100% Sustainable
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              All products verified for environmental compliance and sustainability standards
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Trusted Partners
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Network of verified suppliers committed to quality and sustainability
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Secure Platform
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Enterprise-grade security with payment verification and order tracking
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Get In Touch
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Have questions? We're here to help. Reach out to our team for support.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📧</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                  <p className="text-gray-600 dark:text-gray-400">support@ecogreen.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📞</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                  <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📍</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Address</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    123 Green Street<br />
                    Eco City, EC 12345
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🕐</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Business Hours</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Send us a message
            </h4>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="input"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="input"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="input"
              />
              <button type="button" className="btn btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-lg mb-6 opacity-90">
            Join Eco Green today and be part of the sustainable future
          </p>
          <Link href="/login?mode=register" className="btn bg-white text-green-600 hover:bg-gray-100">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌿</span>
                </div>
                <h3 className="text-xl font-bold">Eco Green</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Sustainable supply chain solutions for a better tomorrow.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-white">Services</a></li>
                <li><a href="#products" className="hover:text-white">Products</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Eco Green. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
