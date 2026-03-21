import { Card,CardContent } from "../NexaUi/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Computer Science Student",
    avatar: "PS",
    quote: "Nexa.AI helped me understand complex algorithms in minutes. It's like having a tutor available 24/7!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Data Science Learner",
    avatar: "RV",
    quote: "The career guidance feature is incredible. Nexa helped me build a roadmap for my data science journey.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Web Development Student",
    avatar: "AP",
    quote: "Quick, accurate, and always helpful. Nexa.AI has become my go-to study companion.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container-main">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Students <span className="text-gradient">Love Nexa.AI</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from students who have transformed their learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              variant="testimonial"
              className="group relative overflow-hidden"
            >
              <CardContent className="p-8">
                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-16 h-16 text-green-500" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-green-400 text-green-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-cta flex items-center justify-center text-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
