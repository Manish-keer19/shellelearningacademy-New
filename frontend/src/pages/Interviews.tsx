import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  Clock, 
  Users, 
  Star, 
  Play, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Target,
  BookOpen
} from "lucide-react";

export const Interviews = () => {
  const [activeTab, setActiveTab] = useState("preparation");

  const interviewPrep = [
    {
      id: 1,
      title: "Technical Interview Mastery",
      description: "Master coding interviews with data structures, algorithms, and system design",
      category: "Technical",
      duration: "4 weeks",
      level: "Intermediate",
      rating: 4.9,
      studentsEnrolled: 2340,
      topics: ["Data Structures", "Algorithms", "System Design", "Coding Patterns"],
      price: "$199",
      instructor: "Sarah Johnson",
      image: "/api/placeholder/400/250",
      features: [
        "100+ coding problems",
        "Mock interview sessions",
        "System design templates",
        "Interview feedback"
      ]
    },
    {
      id: 2,
      title: "Behavioral Interview Excellence",
      description: "Ace behavioral interviews with proven frameworks and real-world scenarios",
      category: "Behavioral",
      duration: "2 weeks",
      level: "Beginner",
      rating: 4.8,
      studentsEnrolled: 1890,
      topics: ["STAR Method", "Leadership Stories", "Conflict Resolution", "Career Goals"],
      price: "$99",
      instructor: "Michael Chen",
      image: "/api/placeholder/400/250",
      features: [
        "STAR framework training",
        "50+ practice questions",
        "Video mock interviews",
        "Personal story development"
      ]
    }
  ];

  const mockInterviews = [
    {
      id: 1,
      title: "Frontend Developer Interview",
      company: "Tech Corp",
      interviewer: "Alex Rodriguez",
      scheduledDate: "2024-02-15",
      duration: "60 minutes",
      status: "scheduled",
      type: "Technical",
      topics: ["React", "JavaScript", "CSS", "Problem Solving"]
    },
    {
      id: 2,
      title: "Product Manager Interview",
      company: "Innovation Labs",
      interviewer: "Emma Wilson",
      scheduledDate: "2024-02-12",
      duration: "45 minutes",
      status: "completed",
      type: "Behavioral",
      score: 85,
      feedback: "Strong communication skills, good product thinking"
    }
  ];

  const interviewStats = {
    totalInterviews: 12,
    averageScore: 78,
    improvementRate: 23,
    completionRate: 92
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Interview Preparation</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Master your interview skills with expert guidance and realistic practice sessions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{interviewStats.totalInterviews}</p>
                  <p className="text-sm text-muted-foreground">Total Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{interviewStats.averageScore}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">+{interviewStats.improvementRate}%</p>
                  <p className="text-sm text-muted-foreground">Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{interviewStats.completionRate}%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="preparation">Interview Prep</TabsTrigger>
            <TabsTrigger value="mock">Mock Interviews</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          {/* Interview Preparation */}
          <TabsContent value="preparation">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {interviewPrep.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 p-6 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary" />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <CardDescription className="mt-2">{course.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{course.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.studentsEnrolled} enrolled
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                    </div>

                    {/* Topics */}
                    <div>
                      <p className="mb-2 text-sm font-medium">Topics covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {course.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="mb-2 text-sm font-medium">What's included:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {course.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Instructor:</span>
                      <span className="text-muted-foreground">{course.instructor}</span>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-primary">{course.price}</span>
                        <span className="text-sm text-muted-foreground ml-1">USD</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                        <Button size="sm">
                          Enroll Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mock Interviews */}
          <TabsContent value="mock">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Mock Interview Sessions</h2>
                <Button>
                  Schedule New Interview
                </Button>
              </div>
              
              <div className="grid gap-4">
                {mockInterviews.map((interview) => (
                  <Card key={interview.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{interview.title}</CardTitle>
                          <CardDescription>
                            {interview.company} • {interview.interviewer}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(interview.status)}>
                          {interview.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Date:</p>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(interview.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Duration:</p>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {interview.duration}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Type:</p>
                          <p className="text-muted-foreground">{interview.type}</p>
                        </div>
                        {interview.score && (
                          <div>
                            <p className="font-medium">Score:</p>
                            <p className="text-muted-foreground font-bold text-green-600">
                              {interview.score}%
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Topics */}
                      <div>
                        <p className="mb-2 text-sm font-medium">Focus Areas:</p>
                        <div className="flex flex-wrap gap-2">
                          {interview.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Feedback */}
                      {interview.feedback && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Feedback:</p>
                          <p className="text-sm text-muted-foreground">{interview.feedback}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        {interview.status === "scheduled" ? (
                          <>
                            <Button size="sm" className="flex items-center gap-2">
                              <Play className="h-4 w-4" />
                              Join Interview
                            </Button>
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm">
                              View Recording
                            </Button>
                            <Button variant="outline" size="sm">
                              Download Report
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Progress */}
          <TabsContent value="progress">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Interview Progress</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Development</CardTitle>
                    <CardDescription>Track your improvement across different areas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Technical Skills</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Communication</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Problem Solving</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Behavioral Questions</span>
                        <span>71%</span>
                      </div>
                      <Progress value={71} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                    <CardDescription>Your latest milestones and improvements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Completed Technical Interview Prep</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Scored 90% in Mock Interview</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">25% Improvement in Communication</p>
                        <p className="text-xs text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};