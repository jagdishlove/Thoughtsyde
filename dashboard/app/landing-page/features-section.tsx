import { 
  Zap, 
  Shield, 
  BarChart3, 
  Lock, 
  Users, 
  Headphones,
  Code,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    title: 'Seamless Integration',
    description: 'One line of code to embed the widget. Works with React, Vue, Angular, or vanilla HTML.',
    icon: Code,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Customizable',
    description: 'Customize the widget appearance to match your brand colors and style effortlessly.',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    title: 'Real-time Analytics',
    description: 'Track and analyze feedback with powerful insights. Filter by rating, export data, and more.',
    icon: BarChart3,
    color: 'bg-green-100 text-green-700',
  },
  {
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We never share your customer feedback with third parties.',
    icon: Lock,
    color: 'bg-red-100 text-red-700',
  },
  {
    title: 'Unlimited Users',
    description: 'All plans include unlimited users and submissions. Collect as much feedback as you need.',
    icon: Users,
    color: 'bg-purple-100 text-purple-700',
  },
  {
    title: 'Priority Support',
    description: 'Get help when you need it. Fast support team ready to assist with any questions.',
    icon: Headphones,
    color: 'bg-pink-100 text-pink-700',
  },
  {
    title: 'Works Everywhere',
    description: 'Compatible with all major frameworks and platforms. Static sites, SPAs, and more.',
    icon: Globe,
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    title: 'Scalable',
    description: 'From startups to enterprise, our infrastructure scales with your business needs.',
    icon: Shield,
    color: 'bg-teal-100 text-teal-700',
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Collect Feedback
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features to help you understand your users and build better products
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white 
                          hover:-translate-y-2 cursor-default animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 
                                  group-hover:scale-110 transition-transform duration-500 
                                  group-hover:rotate-3`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed 
                                              group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;