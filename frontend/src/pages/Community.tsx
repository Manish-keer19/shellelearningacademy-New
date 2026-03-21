import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Calendar, 
  Heart, 
  Reply, 
  Pin,
  Award,
  BookOpen,
  Code,
  Briefcase
} from "lucide-react";

export const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");

  const communityStats = {
    totalMembers: 15420,
    activeDiscussions: 342,
    questionsAnswered: 2847,
    expertMentors: 89
  };

  const discussions = [
    {
      id: 1,
      title: "Best practices for React state management in 2024",
      author: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40",
        badge: "Expert"
      },
      category: "React",
      replies: 23,
      likes: 45,
      lastActivity: "2 hours ago",
      isPinned: true,
      tags: ["React", "State Management", "Redux", "Context API"]
    },
    {
      id: 2,
      title: "How to prepare for technical interviews at FAANG companies?",
      author: {
        name: "Michael Chen",
        avatar: "/api/placeholder/40/40",
        badge: "Mentor"
      },
      category: "Career",
      replies: 67,
      likes: 128,
      lastActivity: "4 hours ago",
      isPinned: false,
      tags: ["Interview", "FAANG", "Career", "Preparation"]
    },
    {
      id: 3,
      title: "Machine Learning project ideas for beginners",
      author: {
        name: "Emma Wilson",
        avatar: "/api/placeholder/40/40",
        badge: "Student"
      },
      category: "Machine Learning",
      replies: 34,
      likes: 89,
      lastActivity: "6 hours ago",
      isPinned: false,
      tags: ["ML", "Projects", "Beginner", "Python"]
    }
  ];

  const events = [
    {
      id: 1,
      title: "Web Development Bootcamp Graduation",
      date: "2024-02-20",
      time: "6:00 PM EST",
      type: "Virtual Event",
      attendees: 156,
      description: "Celebrate with our latest web development graduates and network with industry professionals."
    },
    {
      id: 2,
      title: "AI/ML Study Group - Weekly Meetup",
      date: "2024-02-18",
      time: "2:00 PM EST",
      type: "Study Group",
      attendees: 45,
      description: "Join our weekly AI/ML study group to discuss latest trends and work on projects together."
    },
    {
      id: 3,
      title: "Career Fair - Tech Companies Hiring",
      date: "2024-02-25",
      time: "10:00 AM EST",
      type: "Career Event",
      attendees: 289,
      description: "Connect with top tech companies actively hiring. Bring your resume and portfolio!"
    }
  ];

  const mentors = [
    {
      id: 1,
      name: "Dr. Alex Rodriguez",
      title: "Senior Software Engineer at Google",
      expertise: ["Full Stack", "System Design", "Leadership"],
      rating: 4.9,
      sessions: 127,
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 2,
      name: "Lisa Park",
      title: "Data Scientist at Microsoft",
      expertise: ["Machine Learning", "Python", "Statistics"],
      rating: 4.8,
      sessions: 89,
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 3,
      name: "James Wilson",
      title: "Product Manager at Meta",
      expertise: ["Product Strategy", "User Research", "Analytics"],
      rating: 4.9,
      sessions: 156,
      avatar: "/api/placeholder/60/60"
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Expert": return "bg-purple-100 text-purple-800";
      case "Mentor": return "bg-blue-100 text-blue-800";
      case "Student": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Community</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Connect, learn, and grow with fellow learners and industry experts
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="text-2xl font-bold">{communityStats.totalMembers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Community Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{communityStats.activeDiscussions}</p>
              <p className="text-sm text-muted-foreground">Active Discussions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold">{communityStats.questionsAnswered.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold">{communityStats.expertMentors}</p>
              <p className="text-sm text-muted-foreground">Expert Mentors</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="groups">Study Groups</TabsTrigger>
          </TabsList>

          {/* Discussions */}
          <TabsContent value="discussions">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Community Discussions</h2>
                <Button>
                  Start New Discussion
                </Button>
              </div>
              
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={discussion.author.avatar} />
                          <AvatarFallback>
                            {discussion.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {discussion.isPinned && (
                                  <Pin className="h-4 w-4 text-primary" />
                                )}
                                <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                                  {discussion.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{discussion.author.name}</span>
                                <Badge className={getBadgeColor(discussion.author.badge)} variant="secondary">
                                  {discussion.author.badge}
                                </Badge>
                                <span>•</span>
                                <span>{discussion.lastActivity}</span>
                              </div>
                            </div>
                            <Badge variant="outline">{discussion.category}</Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Reply className="h-4 w-4" />
                              {discussion.replies} replies
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {discussion.likes} likes
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Button>
                  Create Event
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription className="mt-2">{event.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees} attending
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          Join Event
                        </Button>
                        <Button variant="outline" size="sm">
                          Add to Calendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Mentors */}
          <TabsContent value="mentors">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Expert Mentors</h2>
                <Button>
                  Become a Mentor
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {mentors.map((mentor) => (
                  <Card key={mentor.id}>
                    <CardHeader className="text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-4">
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback>
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription>{mentor.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Expertise:</p>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {mentor.rating} rating
                        </div>
                        <div>
                          {mentor.sessions} sessions
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Book Session
                        </Button>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Study Groups */}
          <TabsContent value="groups">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Study Groups</h2>
                <Button>
                  Create Study Group
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Code className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>JavaScript Fundamentals</CardTitle>
                        <CardDescription>Weekly study sessions for JS beginners</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        24 members
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Wednesdays 7PM EST
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Join Group
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle>Data Science Study Circle</CardTitle>
                        <CardDescription>Advanced topics in ML and statistics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        18 members
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Saturdays 2PM EST
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Join Group
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Briefcase className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle>Career Development Hub</CardTitle>
                        <CardDescription>Interview prep and career guidance</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        31 members
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Fridays 6PM EST
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Join Group
                    </Button>
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