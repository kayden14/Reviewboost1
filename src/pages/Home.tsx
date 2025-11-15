import { Shield, Zap, Award, TrendingUp } from 'lucide-react';

type HomeProps = {
  onNavigate: (page: string) => void;
};

export default function Home({ onNavigate }: HomeProps) {
  const features = [
    { icon: Shield, title: 'Verified Reviews', description: 'Every review is skill-validated through our rigorous vetting process' },
    { icon: Zap, title: 'Smart Matching', description: 'AI-powered engine matches you with the perfect review opportunities' },
    { icon: Award, title: 'Build Credibility', description: 'Establish your professional reputation on leading platforms' },
    { icon: TrendingUp, title: 'Accelerate Growth', description: 'Win more work and command higher rates with verified reviews' },
  ];

  const steps = [
    { number: '01', title: 'Sign Up & Submit Profile', description: 'Create your account and share your skills, credentials, and portfolio' },
    { number: '02', title: 'AI Vetting & Verification', description: 'Our smart matching engine evaluates your profile and skills' },
    { number: '03', title: 'Request Reviews', description: 'Choose your package and submit payment for verified reviews' },
    { number: '04', title: 'Get Verified Reviews', description: 'Receive skill-validated reviews on your target platforms' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Web Developer', content: 'ReviewBoost helped me establish credibility on Upwork.', rating: 5 },
    { name: 'Michael Chen', role: 'Graphic Designer', content: 'The verification process is thorough and professional.', rating: 5 },
    { name: 'Emily Rodriguez', role: 'Content Writer', content: 'Building trust was the hardest part of freelancing.', rating: 5 },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Build Trust, Boost Your Freelance Career</h1>
          <p className="text-xl md:text-2xl mb-8 text-teal-50">
            Earn verified, skill-validated reviews that establish credibility and accelerate your success on leading freelancing platforms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate('signup')} className="px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-lg hover:bg-gray-100 shadow-lg">
              Get Started Free
            </button>
            <button onClick={() => onNavigate('for-freelancers')} className="px-8 py-4 bg-teal-700 text-white font-bold text-lg rounded-lg hover:bg-teal-800">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Why Choose ReviewBoost?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full text-white font-bold text-xl mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Trusted by Freelancers Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-gray-700 mb-4">{t.content}</p>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-600">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Reputation?</h2>
          <p className="text-xl mb-8">Join thousands of freelancers who have accelerated their careers with ReviewBoost</p>
          <button onClick={() => onNavigate('signup')} className="px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-lg hover:bg-gray-100 shadow-lg">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}
