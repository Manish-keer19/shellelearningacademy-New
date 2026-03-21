import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { leadService } from "@/service/lead.service";
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
import { Loader2, Search, Users, Mail, Phone, GraduationCap, Building2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Lead {
    _id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    source: string;
    createdAt: string;
}

const Leads = () => {
    const navigate = useNavigate();
    const { user, accessToken, isLoading } = useAppSelector((state) => state.auth);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, today: 0 });

    useEffect(() => {
        // Don't redirect while still loading auth state from localStorage
        if (isLoading) return;

        if (!accessToken || user?.accountType !== 'Admin') {
            navigate('/auth');
            return;
        }
        fetchLeads();
        fetchStats();
    }, [accessToken, user, navigate, isLoading]);

    useEffect(() => {
        filterLeads();
    }, [searchTerm, leads]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await leadService.getAllLeads(accessToken!);
            setLeads(response.data);
        } catch (error: any) {
            console.error("Failed to fetch leads:", error);
            toast.error(error.response?.data?.message || "Failed to fetch leads");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await leadService.getLeadStats(accessToken!);
            setStats(response.data);
        } catch (error: any) {
            console.error("Failed to fetch stats:", error);
        }
    };

    const filterLeads = () => {
        let filtered = leads;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(lead =>
                lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.phone.includes(searchTerm)
            );
        }

        setFilteredLeads(filtered);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-foreground flex items-center gap-3">
                        <Sparkles className="w-10 h-10 text-primary" />
                        Nexa <span className="text-primary">Leads</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        View all leads captured from Nexa AI Chatbot
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium">Total Leads</CardDescription>
                            <CardTitle className="text-4xl font-bold flex items-center gap-3">
                                <Users className="w-8 h-8 text-primary" />
                                {stats.total}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium">Today's Leads</CardDescription>
                            <CardTitle className="text-4xl font-bold flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-green-500" />
                                {stats.today}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Search Filter */}
                <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Search Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search by name, email, phone, or college..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Leads Table */}
                <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">All Leads ({filteredLeads.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : filteredLeads.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Year</TableHead>
                                            <TableHead>Source</TableHead>
                                            <TableHead>Captured On</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLeads.map((lead) => (
                                            <TableRow key={lead._id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                                        {lead.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm">{lead.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                                        {lead.phone}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm line-clamp-1">{lead.college}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{lead.year}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3 text-primary" />
                                                        <span className="text-xs font-medium">{lead.source}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Leads Found</h3>
                                <p className="text-muted-foreground">
                                    {searchTerm
                                        ? 'Try adjusting your search'
                                        : 'No leads captured yet'}
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

export default Leads;
