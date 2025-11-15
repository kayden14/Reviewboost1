import { Shield, Zap, Award, TrendingUp, CheckCircle, Users } from 'lucide-react';

type HomeProps = {
  onNavigate: (page: string) => void;
};

export default function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: Shield,
      title: 'Verified Reviews',
      description: 'Every review is skill-validated through our rigorous vetting process',
    },
    {
      icon: Zap,
      title: 'Smart Matching',
      description: 'AI-powered engine matches you with the perfect review opportunities',
    },
    {
      icon: Award,
      title: 'Build Credibility',
      description: 'Establish your professional reputation on leading platforms',
    },
    {
      icon: TrendingUp,
      title: 'Accelerate Growth',
      description: 'Win more work and command higher rates with verified reviews',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign Up & Submit Profile',
      description: 'Create your account and share your skills, credentials, and portfolio',
    },
    {
      number: '02',
      title: 'AI Vetting & Verification',
      description: 'Our smart matching engine evaluates your profile and skills',
    },
    {
      number: '03',
      title: 'Request Reviews',
      description: 'Choose your package and submit payment for verified reviews',
    },
    {
      number: '04',
      title: 'Get Verified Reviews',
      description: 'Receive skill-validated reviews on your target platforms',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Web Developer',
      content: 'ReviewBoost helped me establish credibility on Upwork. Within weeks, I doubled my client inquiries!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Graphic Designer',
      content: 'The verification process is thorough and professional. My reviews are authentic and trusted by clients.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Content Writer',
      content: 'Building trust was the hardest part of freelancing. ReviewBoost made it simple and fast.',
      rating: 5,
    },
  ];

  return (
    <div className="bg-white">
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Build Trust, Boost Your Freelance Career
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-50">
              Earn verified, skill-validated reviews that establish credibility and accelerate your success on leading freelancing platforms
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('signup')}
                className="px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => onNavigate('for-freelancers')}
                className="px-8 py-4 bg-teal-700 text-white font-bold text-lg rounded-lg hover:bg-teal-800 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ReviewBoost?
            </h2>
            <p className="text-xl text-gray-600">
              The trusted platform for building verified freelance credibility
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
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

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to verified credibility
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full text-white font-bold text-xl mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 -ml-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Freelancers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Reputation?
          </h2>
          <p className="text-xl mb-8 text-teal-50">
            Join thousands of freelancers who have accelerated their careers with ReviewBoost
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}
