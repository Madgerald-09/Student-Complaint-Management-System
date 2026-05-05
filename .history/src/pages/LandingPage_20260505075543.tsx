import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Shield, 
  Clock, 
  BarChart3, 
  CheckCircle, 
  Menu, 
  X,
  GraduationCap,
  Users,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import Logo from '@/components/Logo';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Easy Submission',
      description: 'Submit complaints quickly with our intuitive form system. Attach files and track status in real-time.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your complaints are encrypted and only accessible to authorized administrators.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Fast Response',
      description: 'Get timely responses with our automated notification system and priority handling.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Track Progress',
      description: 'Monitor the status of your complaints from submission to resolution.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Complaints Resolved' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24h', label: 'Avg. Response Time' },
    { value: '50+', label: 'Partner Institutions' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'This system made it so easy to report my accommodation issues. It was resolved within 48 hours!',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Engineering Student',
      content: 'The transparency and tracking features are excellent. I always know the status of my complaints.',
      avatar: 'MC',
    },
    {
      name: 'Emily Davis',
      role: 'Business Student',
      content: 'Professional and efficient. The admin team is very responsive through this platform.',
      avatar: 'ED',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-border' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <Logo size="sm" />
              <span className="hidden sm:inline text-lg font-bold text-foreground">Complaint Portal</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <Link to="/student-auth" className="text-muted-foreground hover:text-foreground transition-colors">Student Login</Link>
              <Link to="/admin-auth">
                <Button variant="outline" size="sm">Admin Portal</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-border">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-muted-foreground hover:text-foreground">Features</a>
              <a href="#how-it-works" className="block py-2 text-muted-foreground hover:text-foreground">How It Works</a>
              <a href="#testimonials" className="block py-2 text-muted-foreground hover:text-foreground">Testimonials</a>
              <Link to="/student-auth" className="block py-2 text-muted-foreground hover:text-foreground">Student Login</Link>
              <Link to="/admin-auth" className="block py-2 text-muted-foreground hover:text-foreground">Admin Portal</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Student Complaint
              <span className="text-primary"> Management </span>
              System
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A modern, secure, and efficient platform for students to submit complaints 
              and administrators to manage and resolve them quickly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/student-auth">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Student Portal
                </Button>
              </Link>
              <Link to="/admin-auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground">
              Designed with both students and administrators in mind, our system offers 
              a comprehensive solution for complaint management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Getting your complaint resolved is simple and straightforward with our 4-step process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up as a student with your institutional email' },
              { step: '02', title: 'Submit Complaint', desc: 'Fill out the complaint form with details and attachments' },
              { step: '03', title: 'Track Status', desc: 'Monitor your complaint status in real-time' },
              { step: '04', title: 'Get Resolution', desc: 'Receive updates and resolution from administrators' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {index < 3 && (
                  <ArrowRight className="hidden lg:block absolute top-8 right-0 w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Student Card */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-primary" />
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">For Students</h3>
                <ul className="space-y-3 mb-8">
                  {[
                    'Submit complaints easily',
                    'Track complaint status',
                    'Receive notifications',
                    'View complaint history',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/student-auth">
                  <Button className="w-full">Get Started as Student</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-primary" />
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">For Administrators</h3>
                <ul className="space-y-3 mb-8">
                  {[
                    'Manage all complaints',
                    'Assign to departments',
                    'Generate reports',
                    'Track resolution metrics',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/admin-auth">
                  <Button variant="outline" className="w-full">Access Admin Portal</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Students Say
            </h2>
            <p className="text-muted-foreground">
              Hear from students who have used our platform to resolve their complaints.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join thousands of students who trust our platform for their complaint management needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/student-auth">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/admin-auth">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-white/30 text-white hover:bg-white/10">
                    Admin Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">ComplaintPortal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering students and institutions with efficient complaint management solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/student-auth" className="hover:text-foreground">Student Login</Link></li>
                <li><Link to="/admin-auth" className="hover:text-foreground">Admin Login</Link></li>
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">FAQs</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> support@complaintportal.com</li>
                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +1 (555) 123-4567</li>
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> 123 Campus Drive</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2026 ComplaintPortal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
