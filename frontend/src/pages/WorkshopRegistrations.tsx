import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { workshopService } from "@/service/workshop.service";
import { useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Users, Calendar, Mail, Phone, GraduationCap, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { WorkshopApplicationsSkeleton } from "@/components/DashboardSkeleton";

interface Registration {
    _id: string;
    workshop: {
        _id: string;
        title: string;
        date: string;
        time: string;
        mode: string;
        type: string;
        price: number;
    };
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    createdAt: string;
}

const WorkshopRegistrations = () => {
    const navigate = useNavigate();
    const { user, accessToken, isLoading } = useAppSelector((state) => state.auth);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Don't redirect while still loading auth state from localStorage
        if (isLoading) return;

        if (!accessToken || user?.accountType !== 'Admin') {
            navigate('/auth');
            return;
        }
        fetchRegistrations();
    }, [accessToken, user, navigate, isLoading]);

    useEffect(() => {
        filterRegistrations();
    }, [searchTerm, registrations]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await workshopService.getAllWorkshopRegistrations(accessToken!);
            setRegistrations(response.data);
        } catch (error: any) {
            console.error("Failed to fetch registrations:", error);
            toast.error(error.response?.data?.message || "Failed to fetch registrations");
        } finally {
            setLoading(false);
        }
    };

    const filterRegistrations = () => {
        let filtered = registrations;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(reg =>
                reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.workshop?.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredRegistrations(filtered);
    };

    // Show skeleton while auth is loading or data is being fetched
    if (isLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
                <Navbar />
                <WorkshopApplicationsSkeleton />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-foreground">
                        Workshop <span className="text-primary">Applications</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        View all workshop registration applications
                    </p>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium">Total Applications</CardDescription>
                            <CardTitle className="text-4xl font-bold flex items-center gap-3">
                                <Users className="w-8 h-8 text-primary" />
                                {registrations.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Search Filter */}
                <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Search Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search by name, email, college, or workshop..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Registrations Table */}
                <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">All Applications ({filteredRegistrations.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredRegistrations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Workshop</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Year</TableHead>
                                            <TableHead>Applied On</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRegistrations.map((registration) => (
                                            <TableRow key={registration._id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-start gap-2">
                                                        <Calendar className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                                        <div>
                                                            <div className="font-semibold line-clamp-1">{registration.workshop?.title || 'Deleted Workshop'}</div>
                                                            <div className="text-xs text-muted-foreground">{registration.workshop?.date || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                                        {registration.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm">{registration.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                                        {registration.phone}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm line-clamp-1">{registration.college}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{registration.year}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(registration.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Applications Found</h3>
                                <p className="text-muted-foreground">
                                    {searchTerm
                                        ? 'Try adjusting your search'
                                        : 'No workshop registrations yet'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
};

export default WorkshopRegistrations;
