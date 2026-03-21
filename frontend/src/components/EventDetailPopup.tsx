import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Calendar, Clock, MapPin, Users, IndianRupee, BookOpen, User, DollarSign } from "lucide-react";
import { EventRegistrationForm } from "./EventRegistrationForm";

export const EventDetailPopup = ({ event, onClose }) => {
    // Safety check for null event object
    if (!event) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <Card className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl animate-fade-in-up">
                
                {/* Header with Title and Close Button */}
                <CardHeader className="sticky top-0 bg-card/90 backdrop-blur-sm z-10 border-b border-border p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-3xl font-extrabold text-foreground">{event.title}</CardTitle>
                            {/* Assuming event.speaker is a simple string for subtitle/mode */}
                            <p className="text-sm font-medium text-primary mt-1">{event.mode} | {event.speaker || 'Expert Panel'}</p> 
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-primary/10 transition-colors">
                            <X className="h-6 w-6 text-foreground" />
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-8">
                    
                    {/* Event Summary / Description */}
                    <div>
                        <h3 className="mb-3 text-xl font-bold border-b pb-1 text-primary">Summary</h3>
                        <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                    </div>

                    <Separator />

                    {/* Event Metadata (Date, Time, Location, Price) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                        
                        {/* Date */}
                        <div className="flex flex-col items-start space-y-1">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <Calendar className="h-5 w-5" />
                                <span className="text-sm">DATE</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">{event.date}</p>
                        </div>

                        {/* Time */}
                        <div className="flex flex-col items-start space-y-1">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <Clock className="h-5 w-5" />
                                <span className="text-sm">TIME</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">{event.time}</p>
                        </div>

                        {/* Location / Mode */}
                        <div className="flex flex-col items-start space-y-1">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <MapPin className="h-5 w-5" />
                                <span className="text-sm">LOCATION</span>
                            </div>
                            <p className="text-lg font-bold text-foreground truncate">{event.venue || event.mode}</p>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-start space-y-1">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <DollarSign className="h-5 w-5" />
                                <span className="text-sm">PRICE</span>
                            </div>
                            <p className="text-lg font-bold text-foreground flex items-center">
                                {event.price === 'Free' ? event.price : <IndianRupee className="h-5 w-5 mr-1" />}
                                {event.price !== 'Free' ? event.price : ''}
                            </p>
                        </div>
                    </div> {/* End Metadata Grid */}
                    
                    <Separator />
                    
                    {/* Speakers */}
                    <div>
                        <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                            <User className="h-6 w-6 text-primary" /> Expert Speaker(s)
                        </h3>
                        {/* FIX: Use optional chaining ?. before .map() for safety */}
                        {event.speakers?.map((speaker, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 border-l-4 border-primary/50 pl-3 py-2 my-2 bg-muted/10 rounded-sm">
                                <p className="font-bold text-lg text-foreground w-32 shrink-0">{speaker.name}</p>
                                {/* Assuming 'bio' holds the speaker's title/info */}
                                <p className="text-sm text-muted-foreground">{speaker.bio}</p>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    {/* Agenda */}
                    <div>
                        <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                            <Clock className="h-6 w-6 text-primary" /> Detailed Agenda
                        </h3>
                        <ul className="list-disc space-y-2 pl-6 text-foreground/80">
                            {/* FIX: Use optional chaining ?. before .map() for safety */}
                            {event.agenda?.map((item, index) => (
                                <li key={index} className="pl-2">{item}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <Separator />
                    
                    {/* What you will learn & Who can attend (Side-by-Side on Desktop) */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-primary" /> What you will learn
                            </h3>
                            <ul className="list-disc space-y-2 pl-6 text-foreground/80">
                                {/* FIX: Use optional chaining ?. before .map() for safety */}
                                {event.benefits?.map((benefit, index) => (
                                    <li key={index} className="pl-2">{benefit}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                                <Users className="h-6 w-6 text-primary" /> Who can attend
                            </h3>
                            <ul className="list-disc space-y-2 pl-6 text-foreground/80">
                                {/* FIX: Use optional chaining ?. before .map() for safety */}
                                {event.whoCanAttend?.map((who, index) => (
                                    <li key={index} className="pl-2">{who}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <Separator />

                    {/* Policy and Seats Left */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <h3 className="text-lg font-semibold text-foreground/80">Available Seats</h3>
                            <p className="text-2xl font-extrabold text-primary flex items-center">
                                {event.seatsLeft}
                                <span className="text-sm font-normal ml-2 text-muted-foreground">Seats Left</span>
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 text-lg font-semibold">Refund Policy</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{event.refundPolicy}</p>
                        </div>
                    </div>

                    <Separator />
                    
                    {/* Registration Form (reusing original component) */}
                    <EventRegistrationForm event={event} />
                    
                </CardContent>
            </Card>
        </div>
    );
};