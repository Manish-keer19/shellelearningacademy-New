import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, Calendar, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { courseClassService } from '@/service/courseClass.service';
import { format } from 'date-fns';

interface ManageClassesProps {
    courseId: string;
    token: string;
}

const ManageClasses: React.FC<ManageClassesProps> = ({ courseId, token }) => {
    const { toast } = useToast();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClassId, setCurrentClassId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        className: '',
        classDescription: '',
        classUrl: '',
        classDate: '',
    });

    const fetchClasses = async () => {
        try {
            setIsLoading(true);
            console.log("Fetching classes for courseId:", courseId);
            const res = await courseClassService.getClassesByCourse(courseId, token);
            console.log("Classes fetched:", res.data);
            setClasses(res.data);
        } catch (error) {
            console.error("Failed to fetch classes", error);
            toast({
                title: "Error",
                description: "Failed to load classes",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("ManageClasses useEffect - courseId:", courseId, "token:", token ? "exists" : "missing");
        if (courseId && token) {
            fetchClasses();
        }
    }, [courseId, token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            className: '',
            classDescription: '',
            classUrl: '',
            classDate: '',
        });
        setIsEditing(false);
        setCurrentClassId(null);
    };

    const handleOpenDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleEditClass = (cls: any) => {
        // Convert UTC date to local datetime-local format
        let localDateTimeString = '';
        if (cls.classDate) {
            const date = new Date(cls.classDate);
            // Adjust for timezone offset to get local time
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - (offset * 60 * 1000));
            localDateTimeString = localDate.toISOString().slice(0, 16);
        }

        setFormData({
            className: cls.className,
            classDescription: cls.classDescription,
            classUrl: cls.classUrl,
            classDate: localDateTimeString,
        });
        setCurrentClassId(cls._id);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.className || !formData.classDate || !formData.classUrl) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);

            // Convert local datetime to UTC ISO string for backend
            const localDate = new Date(formData.classDate);
            const utcDateString = localDate.toISOString();

            const dataToSend = {
                ...formData,
                classDate: utcDateString, // Send UTC time to backend
            };

            if (isEditing && currentClassId) {
                await courseClassService.updateClass({
                    classId: currentClassId,
                    ...dataToSend,
                }, token);
                toast({ title: "Class Updated Successfully" });
            } else {
                await courseClassService.createClass({
                    courseId,
                    ...dataToSend,
                }, token);
                toast({ title: "Class Created Successfully" });
            }
            setIsDialogOpen(false);
            fetchClasses();
            resetForm();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to save class",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClass = async (classId: string) => {
        if (!window.confirm("Are you sure you want to delete this class?")) return;

        try {
            setIsLoading(true);
            await courseClassService.deleteClass({ classId, courseId }, token);
            toast({ title: "Class Deleted Successfully" });
            fetchClasses();
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to delete class",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-card/80 backdrop-blur-lg border-border mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold">Upcoming Classes</CardTitle>
                    <p className="text-muted-foreground text-sm">Schedule and manage live classes for this course.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleOpenDialog}>
                            <Plus className="w-4 h-4 mr-2" /> Add Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? "Edit Class" : "Schedule New Class"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="className">Class Name *</Label>
                                <Input
                                    id="className"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Introduction to React"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="classDate">Date & Time *</Label>
                                <Input
                                    id="classDate"
                                    name="classDate"
                                    type="datetime-local"
                                    value={formData.classDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="classUrl">Meeting URL *</Label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                        <LinkIcon className="h-4 w-4" />
                                    </span>
                                    <Input
                                        id="classUrl"
                                        name="classUrl"
                                        value={formData.classUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://zoom.us/..."
                                        className="rounded-l-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="classDescription">Description</Label>
                                <Textarea
                                    id="classDescription"
                                    name="classDescription"
                                    value={formData.classDescription}
                                    onChange={handleInputChange}
                                    placeholder="Brief agenda..."
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : (isEditing ? "Update Class" : "Schedule Class")}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {classes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No upcoming classes scheduled.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Class Name</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Link</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classes.map((cls: any) => (
                                    <TableRow key={cls._id}>
                                        <TableCell className="font-medium">
                                            <div>{cls.className}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{cls.classDescription}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-2 text-muted-foreground" />
                                                {cls.classDate ? format(new Date(cls.classDate), "PP p") : "Invalid Date"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <a href={cls.classUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                                                Join <ExternalLink className="w-3 h-3 ml-1" />
                                            </a>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClass(cls)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClass(cls._id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ManageClasses;
