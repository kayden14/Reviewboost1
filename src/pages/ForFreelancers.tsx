import { Shield, Target, CheckCircle, DollarSign, Clock, Award } from 'lucide-react';

type ForFreelancersProps = {
  onNavigate: (page: string) => void;
};

export default function ForFreelancers({ onNavigate }: ForFreelancersProps) {
  const benefits = [
    {
      icon: Shield,
      title: 'Verified Credibility',
      description: 'Every review goes through rigorous skill validation and admin approval',
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'AI-powered engine matches you with opportunities that fit your expertise',
    },
    {
      icon: Clock,
      title: 'Fast Results',
      description: 'Build your reputation in days, not months',
    },
    {
      icon: DollarSign,
      title: 'Higher Rates',
      description: 'Verified reviews help you command premium pricing',
    },
    {
      icon: Award,
      title: 'Multiple Platforms',
      description: 'Get reviews on Upwork, Fiverr, Freelancer, and more',
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Admin-approved process ensures authenticity and trust',
    },
  ];

  const process = [
    {
      title: 'Complete Your Profile',
      description: 'Share your skills, upload credentials, and showcase your portfolio. Our system evaluates your expertise.',
    },
    {
      title: 'Get Skill-Validated',
      description: 'Our AI matching engine assesses your profile and credentials. Admin team verifies your qualifications.',
    },
    {
      title: 'Choose Your Package',
      description: 'Select from our review packages based on your needs and budget. Secure payment processing included.',
    },
    {
      title: 'Receive Reviews',
      description: 'Get verified, skill-validated reviews posted on your chosen freelancing platforms.',
    },
  ];

  const packages = [
    {
      name: 'Basic',
      price: '$50',
      features: ['1 Verified Review', '1 Platform', 'Standard Processing', 'Email Support'],
    },
    {
      name: 'Standard',
      price: '$100',
      popular: true,
      features: ['2 Verified Reviews', 'Up to 2 Platforms', 'Priority Processing', 'Email & Chat Support'],
    },
    {
      name: 'Premium',
      price: '$200',
      features: ['4 Verified Reviews', 'Up to 3 Platforms', 'Express Processing', 'Priority Support'],
    },
    {
      name: 'Elite',
      price: '$500',
      features: ['10 Verified Reviews', 'All Platforms', 'VIP Processing', 'Dedicated Account Manager'],
    },
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              For Freelancers
            </h1>
            <p className="text-xl text-teal-50">
              Build verified credibility that helps you win more work and command higher rates on leading freelancing platforms
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Verified Reviews Matter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              In competitive freelance markets, credibility is everything. ReviewBoost provides the trust signals that clients look for when hiring.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
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
              The ReviewBoost Process
            </h2>
            <p className="text-xl text-gray-600">
              Simple, transparent, and designed for your success
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {process.map((step, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Package
            </h2>
            <p className="text-xl text-gray-600">
              Flexible options to match your needs and budget
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm p-6 ${
                  pkg.popular ? 'ring-2 ring-teal-500 relative' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate('signup')}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Accelerate Your Freelance Career?
          </h2>
          <p className="text-xl mb-8 text-teal-50">
            Join ReviewBoost today and start building the credibility you need to succeed
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
}
