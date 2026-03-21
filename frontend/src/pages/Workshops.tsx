import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { workshopService } from "@/service/workshop.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Loader2,
  ArrowRight,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WorkshopsSkeleton } from "@/components/DashboardSkeleton";
import { motion } from "framer-motion";

// Define a simple type structure for clarity
interface Workshop {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  mode: "Online" | "Offline" | "Hybrid";
  type: "Free" | "Paid";
  price: number;
  thumbnail: string;
  studentCount?: string;
  // Add other properties if needed
}

const Workshops = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        // Assuming getAllWorkshops returns { data: Workshop[] }
        const response = await workshopService.getAllWorkshops();
        console.log("Workshops API Response:", response);
        console.log("Workshops Data:", response.data);
        setWorkshops(response.data);
      } catch (error) {
        console.error("Failed to fetch workshops:", error);
        // Optionally show a toast error here
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Helper function for styling mode badges
  const getModeBadge = (mode: Workshop["mode"]) => {
    const baseClass =
      "flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full";
    switch (mode) {
      case "Online":
        return (
          <Badge
            className={`${baseClass} bg-blue-100 text-blue-700 hover:bg-blue-100`}
          >
            <Monitor className="w-3 h-3" /> Online
          </Badge>
        );
      case "Offline":
        return (
          <Badge
            className={`${baseClass} bg-orange-100 text-orange-700 hover:bg-orange-100`}
          >
            <MapPin className="w-3 h-3" /> Offline
          </Badge>
        );
      case "Hybrid":
        return (
          <Badge
            className={`${baseClass} bg-purple-100 text-purple-700 hover:bg-purple-100`}
          >
            <TrendingUp className="w-3 h-3" /> Hybrid
          </Badge>
        );
      default:
        return null;
    }
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <>
        <Navbar />
        <WorkshopsSkeleton />
      </>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <Navbar />

      {/* Premium Hero Section */}
      <div className="pt-32 pb-20 bg-gradient-to-r from-green-600 to-green-800 shadow-lg overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Elevate Your Skills.{" "}
            <span className="text-green-200">Attend a Workshop.</span>
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto opacity-90 mt-4">
            Discover hands-on, expert-led sessions designed to fast-track your
            professional growth.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 border-b pb-3 flex items-center gap-2">
          <Zap className="w-6 h-6 text-green-600" /> Available Workshops (
          {workshops.length})
        </h2>

        {/* Workshop Grid */}
        {workshops.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {workshops.map((workshop, index) => (
              <motion.div
                key={workshop._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card
                  // Added subtle border and strong hover effects
                  className="flex flex-col h-full overflow-hidden shadow-lg border-t-4 border-green-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Thumbnail & Price Badge */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={
                        workshop.thumbnail ||
                        "https://via.placeholder.com/800x450/10b981/ffffff?text=Workshop+Image"
                      }
                      alt={workshop.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        console.error(
                          `Failed to load image for workshop: ${workshop.title}`,
                          workshop.thumbnail,
                        );
                        e.currentTarget.src =
                          "https://via.placeholder.com/1280x720/10b981/ffffff?text=Workshop+Image";
                      }}
                    />
                    <Badge
                      className={`absolute bottom-0 left-0 m-3 px-4 py-1 text-sm font-bold shadow-md 
                                                ${workshop.type === "Free" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {workshop.price > 0 ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{workshop.price.toLocaleString()}</span>
                        </div>
                      ) : (
                        "FREE"
                      )}
                    </Badge>
                  </div>

                  <CardHeader className="pt-6 pb-3">
                    <div className="flex justify-between items-center mb-2">
                      {getModeBadge(workshop.mode)}
                    </div>
                    <CardTitle className="text-2xl font-extrabold line-clamp-2 text-gray-900">
                      {workshop.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-500 mt-2">
                      {workshop.description}
                    </CardDescription>
                  </CardHeader>

                  {/* Workshop Metadata */}
                  <CardContent className="flex-grow space-y-3 pt-0 border-b pb-4">
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
                      <span className="truncate">{workshop.date}</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <Clock className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
                      <span className="truncate">{workshop.time}</span>
                    </div>
                    {workshop.studentCount && (
                      <div className="flex items-center text-sm font-medium text-green-700">
                        <Users className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
                        <span className="truncate">
                          {parseInt(workshop.studentCount).toLocaleString()}{" "}
                          participants
                        </span>
                      </div>
                    )}
                  </CardContent>

                  {/* Action Button */}
                  <CardFooter className="pt-4 mt-auto">
                    <Button
                      className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-300"
                      onClick={() =>
                        navigate(`/workshops/${workshop._id}`, {
                          state: { workshop },
                        })
                      }
                    >
                      Explore & Register <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20  rounded-xl shadow-inner">
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              🚀 No workshops scheduled right now.
            </h3>
            <p className="text-md text-gray-500">
              Check back soon or follow us for updates!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Workshops;
