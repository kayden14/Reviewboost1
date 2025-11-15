import { Target, Heart, Shield, Users } from 'lucide-react';

type AboutProps = {
  onNavigate: (page: string) => void;
};

export default function About({ onNavigate }: AboutProps) {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We maintain the highest standards of verification and authenticity in every review',
    },
    {
      icon: Users,
      title: 'Freelancer Success',
      description: 'Your growth is our mission. We empower freelancers to reach their full potential',
    },
    {
      icon: Heart,
      title: 'Integrity First',
      description: 'Every review is earned through genuine skill validation, never compromising quality',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Leveraging AI and smart matching to create the most efficient verification system',
    },
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About ReviewBoost
            </h1>
            <p className="text-xl text-teal-50">
              Building bridges between talent and opportunity through verified credibility
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              ReviewBoost exists to solve one of the biggest challenges facing freelancers today: building credibility in competitive markets. We connect skilled professionals with verified, skill-validated reviews that establish trust and accelerate career growth.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              Through our rigorous vetting process, smart AI matching engine, and admin-approved workflow, we ensure every review represents genuine skill and authentic professional capability. We're not just a review platform—we're your partner in building a sustainable freelance career.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why We're Different
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Skill-Validated, Not Just Reviews
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Unlike typical review platforms, every ReviewBoost review goes through comprehensive skill validation. Our AI matching engine and admin approval process ensure that reviews reflect genuine professional capability.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Commitment to Quality
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We reject freelancers who don't meet our standards, but we don't leave them behind. We provide resources, guidance, and clear pathways for improvement so they can reapply and succeed in the future.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Trusted by Platforms
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our rigorous verification process makes ReviewBoost a trusted partner for freelancing platforms and clients alike. We're building the future of credible freelance work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 text-teal-50">
            Be part of a growing network of verified freelancers building successful careers
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
