import { Card, CardContent, CardHeader, CardTitle, CardDescription} from "../NexaUi/card";
import {
  Zap,
  GraduationCap,
  Briefcase,
  Clock,
  BookOpen,
  MessageCircle
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Doubt Solving",
    description: "Get immediate answers to your academic questions with detailed explanations.",
  },
  {
    icon: GraduationCap,
    title: "Course Recommendations",
    description: "Receive personalized course suggestions based on your goals and interests.",
  },
  {
    icon: Briefcase,
    title: "Career & Resume Guidance",
    description: "Expert advice on career paths, resume building, and interview preparation.",
  },
  {
    icon: Clock,
    title: "24/7 AI Support",
    description: "Access learning assistance anytime, anywhere without waiting in queues.",
  },
  {
    icon: BookOpen,
    title: "Knowledge-Based Answers",
    description: "Responses sourced from verified educational content and resources.",
  },
  {
    icon: MessageCircle,
    title: "Student-Friendly Interface",
    description: "Easy-to-use chat interface designed for seamless learning experiences.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="section-padding bg-green-50/50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-40 h-40 border border-green-200 rounded-full" />
        <div className="absolute bottom-10 left-10 w-60 h-60 border border-green-200 rounded-full" />
      </div>

      <div className="container-main relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful AI-driven features designed to enhance your learning journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="feature"
              className="group cursor-default"
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-green-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
