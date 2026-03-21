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
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Plus, Edit, Trash2, Calendar, Users, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { WorkshopApplicationsSkeleton } from "@/components/DashboardSkeleton";
import { Badge } from "@/components/ui/badge";

interface Workshop {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    mode: string;
    type: string;
    price: number;
    thumbnail: string;
    status: string;
    whatYouWillLearn: string[];
    whoShouldAttend: string[];
    certification: boolean;
    meetingLink?: string;
    location?: string;
    studentsEnrolled: any[];
    createdAt: string;
}

const WorkshopManagement = () => {
    const navigate = useNavigate();
    const { user, accessToken, isLoading } = useAppSelector((state) => state.auth);
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        mode: '',
        type: '',
        price: 0,
        status: '',
        whatYouWillLearn: '',
        whoShouldAttend: '',
        certification: false,
        meetingLink: '',
        location: '',
        thumbnail: null as File | null,
    });

    useEffect(() => {
        if (isLoading) return;

        if (!accessToken || user?.accountType !== 'Admin') {
            navigate('/auth');
            return;
        }
        fetchWorkshops();
    }, [accessToken, user, navigate, isLoading]);

    useEffect(() => {
        filterWorkshops();
    }, [searchTerm, workshops]);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const response = await workshopService.getAllWorkshopsAdmin(accessToken!);
            setWorkshops(response.data);
        } catch (error: any) {
            console.error("Failed to fetch workshops:", error);
            toast.error(error.response?.data?.message || "Failed to fetch workshops");
        } finally {
            setLoading(false);
        }
    };

    const filterWorkshops = () => {
        let filtered = workshops;

        if (searchTerm) {
            filtered = filtered.filter(workshop =>
                workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                workshop.mode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                workshop.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredWorkshops(filtered);
    };

    const handleDelete = async () => {
        if (!selectedWorkshop) return;

        try {
            setIsDeleting(true);
            await workshopService.deleteWorkshop(selectedWorkshop._id, accessToken!);
            toast.success("Workshop deleted successfully!");
            setDeleteDialogOpen(false);
            setSelectedWorkshop(null);
            fetchWorkshops();
        } catch (error: any) {
            console.error("Failed to delete workshop:", error);
            toast.error(error.response?.data?.message || "Failed to delete workshop");
        } finally {
            setIsDeleting(false);
        }
    };

    const openEditDialog = (workshop: Workshop) => {
        setSelectedWorkshop(workshop);
        setEditForm({
            title: workshop.title,
            description: workshop.description,
            date: workshop.date,
            time: workshop.time,
            mode: workshop.mode,
            type: workshop.type,
            price: workshop.price,
            status: workshop.status,
            whatYouWillLearn: workshop.whatYouWillLearn.join('\n'),
            whoShouldAttend: workshop.whoShouldAttend.join('\n'),
            certification: workshop.certification,
            meetingLink: workshop.meetingLink || '',
            location: workshop.location || '',
            thumbnail: null,
        });
        setEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedWorkshop) return;

        try {
            setIsUpdating(true);
            const formData = new FormData();

            formData.append('title', editForm.title);
            formData.append('description', editForm.description);
            formData.append('date', editForm.date);
            formData.append('time', editForm.time);
            formData.append('mode', editForm.mode);
            formData.append('type', editForm.type);
            formData.append('price', editForm.price.toString());
            formData.append('status', editForm.status);
            formData.append('certification', editForm.certification.toString());

            const whatYouWillLearnArray = editForm.whatYouWillLearn.split('\n').filter(item => item.trim());
            const whoShouldAttendArray = editForm.whoShouldAttend.split('\n').filter(item => item.trim());

            formData.append('whatYouWillLearn', JSON.stringify(whatYouWillLearnArray));
            formData.append('whoShouldAttend', JSON.stringify(whoShouldAttendArray));

            if (editForm.meetingLink) {
                formData.append('meetingLink', editForm.meetingLink);
            }
            if (editForm.location) {
                formData.append('location', editForm.location);
            }
            if (editForm.thumbnail) {
                formData.append('thumbnail', editForm.thumbnail);
            }

            await workshopService.updateWorkshop(selectedWorkshop._id, formData, accessToken!);
            toast.success("Workshop updated successfully!");
            setEditDialogOpen(false);
            setSelectedWorkshop(null);
            fetchWorkshops();
        } catch (error: any) {
            console.error("Failed to update workshop:", error);
            toast.error(error.response?.data?.message || "Failed to update workshop");
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            Published: "default",
            Draft: "secondary",
            Completed: "outline",
            Cancelled: "destructive",
        };
        return <Badge variant={variants[status] || "default"}>{status}</Badge>;
    };

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
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-foreground">
                            Workshop <span className="text-primary">Management</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Manage all workshops - Create, Update, Delete
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/create-workshop')}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Workshop
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium">Total Workshops</CardDescription>
                            <CardTitle className="text-3xl font-bold flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-primary" />
                                {workshops.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium">Published</CardDescription>
                            <CardTitle className="text-3xl font-bold text-green-600">
                                {workshops.filter(w => w.status === 'Published').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium">Drafts</CardDescription>
                            <CardTitle className="text-3xl font-bold text-yellow-600">
                                {workshops.filter(w => w.status === 'Draft').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium">Total Enrollments</CardDescription>
                            <CardTitle className="text-3xl font-bold flex items-center gap-3">
                                <Users className="w-6 h-6 text-primary" />
                                {workshops.reduce((acc, w) => acc + (w.studentsEnrolled?.length || 0), 0)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Search Filter */}
                <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Search Workshops</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search by title, description, mode, or status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Workshops Table */}
                <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">All Workshops ({filteredWorkshops.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredWorkshops.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Workshop</TableHead>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Mode</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Enrolled</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredWorkshops.map((workshop) => (
                                            <TableRow key={workshop._id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-start gap-3">
                                                        <img
                                                            src={workshop.thumbnail}
                                                            alt={workshop.title}
                                                            className="w-16 h-16 rounded object-cover"
                                                        />
                                                        <div>
                                                            <div className="font-semibold line-clamp-1">{workshop.title}</div>
                                                            <div className="text-xs text-muted-foreground line-clamp-2">
                                                                {workshop.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div>{workshop.date}</div>
                                                        <div className="text-muted-foreground">{workshop.time}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{workshop.mode}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={workshop.type === 'Free' ? 'secondary' : 'default'}>
                                                        {workshop.type === 'Free' ? 'Free' : `₹${workshop.price}`}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(workshop.status)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4 text-muted-foreground" />
                                                        {workshop.studentsEnrolled?.length || 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedWorkshop(workshop);
                                                                setViewDialogOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditDialog(workshop)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedWorkshop(workshop);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Workshops Found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm
                                        ? 'Try adjusting your search'
                                        : 'Create your first workshop to get started'}
                                </p>
                                {!searchTerm && (
                                    <Button onClick={() => navigate('/create-workshop')}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Workshop
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Workshop</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedWorkshop?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Workshop</DialogTitle>
                        <DialogDescription>
                            Update workshop details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    value={editForm.date}
                                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    value={editForm.time}
                                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="mode">Mode</Label>
                                <Select value={editForm.mode} onValueChange={(value) => setEditForm({ ...editForm, mode: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Online">Online</SelectItem>
                                        <SelectItem value="Offline">Offline</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={editForm.type} onValueChange={(value) => setEditForm({ ...editForm, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Free">Free</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {editForm.type === 'Paid' && (
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={editForm.price}
                                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Published">Published</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="whatYouWillLearn">What You Will Learn (one per line)</Label>
                            <Textarea
                                id="whatYouWillLearn"
                                value={editForm.whatYouWillLearn}
                                onChange={(e) => setEditForm({ ...editForm, whatYouWillLearn: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="whoShouldAttend">Who Should Attend (one per line)</Label>
                            <Textarea
                                id="whoShouldAttend"
                                value={editForm.whoShouldAttend}
                                onChange={(e) => setEditForm({ ...editForm, whoShouldAttend: e.target.value })}
                                rows={4}
                            />
                        </div>
                        {editForm.mode !== 'Offline' && (
                            <div className="grid gap-2">
                                <Label htmlFor="meetingLink">Meeting Link</Label>
                                <Input
                                    id="meetingLink"
                                    value={editForm.meetingLink}
                                    onChange={(e) => setEditForm({ ...editForm, meetingLink: e.target.value })}
                                />
                            </div>
                        )}
                        {editForm.mode !== 'Online' && (
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="thumbnail">Update Thumbnail (optional)</Label>
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.files?.[0] || null })}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="certification"
                                checked={editForm.certification}
                                onChange={(e) => setEditForm({ ...editForm, certification: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="certification">Provides Certification</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isUpdating}>
                            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Update Workshop
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Workshop Details</DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-4 top-4"
                            onClick={() => setViewDialogOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </DialogHeader>
                    {selectedWorkshop && (
                        <div className="space-y-4">
                            <img
                                src={selectedWorkshop.thumbnail}
                                alt={selectedWorkshop.title}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{selectedWorkshop.title}</h3>
                                <p className="text-muted-foreground">{selectedWorkshop.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Date</Label>
                                    <p className="font-medium">{selectedWorkshop.date}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Time</Label>
                                    <p className="font-medium">{selectedWorkshop.time}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Mode</Label>
                                    <p className="font-medium">{selectedWorkshop.mode}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Type</Label>
                                    <p className="font-medium">
                                        {selectedWorkshop.type === 'Free' ? 'Free' : `Paid - ₹${selectedWorkshop.price}`}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedWorkshop.status)}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Enrolled Students</Label>
                                    <p className="font-medium">{selectedWorkshop.studentsEnrolled?.length || 0}</p>
                                </div>
                            </div>
                            {selectedWorkshop.whatYouWillLearn.length > 0 && (
                                <div>
                                    <Label className="text-muted-foreground">What You Will Learn</Label>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {selectedWorkshop.whatYouWillLearn.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {selectedWorkshop.whoShouldAttend.length > 0 && (
                                <div>
                                    <Label className="text-muted-foreground">Who Should Attend</Label>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {selectedWorkshop.whoShouldAttend.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {selectedWorkshop.meetingLink && (
                                <div>
                                    <Label className="text-muted-foreground">Meeting Link</Label>
                                    <p className="font-medium break-all">{selectedWorkshop.meetingLink}</p>
                                </div>
                            )}
                            {selectedWorkshop.location && (
                                <div>
                                    <Label className="text-muted-foreground">Location</Label>
                                    <p className="font-medium">{selectedWorkshop.location}</p>
                                </div>
                            )}
                            <div>
                                <Label className="text-muted-foreground">Certification</Label>
                                <p className="font-medium">{selectedWorkshop.certification ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default WorkshopManagement;
