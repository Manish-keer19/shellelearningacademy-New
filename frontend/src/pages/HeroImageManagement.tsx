import React, { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Image as ImageIcon,
    Upload,
    Trash2,
    Edit3,
    EyeOff,
    Plus,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowUpDown,
    ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/hooks/redux";
import { heroImageService } from "@/service/heroImage.service";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface HeroSlide {
    _id: string;
    imageUrl: string;
    order: number;
    isActive: boolean;
    createdAt?: string;
}

interface UploadForm {
    order: string;
    isActive: boolean;
    imageFile: File | null;
    imagePreview: string;
}

const EMPTY_FORM: UploadForm = {
    order: "0",
    isActive: true,
    imageFile: null,
    imagePreview: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// Upload / Edit Modal
// ─────────────────────────────────────────────────────────────────────────────
const SlideModal = ({
    isOpen,
    onClose,
    onSubmit,
    editSlide,
    isSubmitting,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (form: UploadForm) => void;
    editSlide: HeroSlide | null;
    isSubmitting: boolean;
}) => {
    const [form, setForm] = useState<UploadForm>(EMPTY_FORM);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editSlide) {
            setForm({
                order: String(editSlide.order),
                isActive: editSlide.isActive,
                imageFile: null,
                imagePreview: editSlide.imageUrl,
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [editSlide, isOpen]);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) =>
            setForm((f) => ({
                ...f,
                imageFile: file,
                imagePreview: ev.target?.result as string,
            }));
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (ev) =>
            setForm((f) => ({
                ...f,
                imageFile: file,
                imagePreview: ev.target?.result as string,
            }));
        reader.readAsDataURL(file);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal card */}
            <div className="relative w-full max-w-lg bg-card border border-border/60 rounded-2xl shadow-2xl z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">
                                {editSlide ? "Edit Slide Image" : "Upload Slide Image"}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {editSlide ? "Replace the image or change the display order" : "Choose an image for the hero slider"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Drag-and-drop / click upload zone */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            Slide Image{" "}
                            {!editSlide && <span className="text-destructive">*</span>}
                        </label>
                        <div
                            className="relative border-2 border-dashed border-primary/30 rounded-xl overflow-hidden cursor-pointer hover:border-primary/60 transition-colors group"
                            style={{ minHeight: "200px" }}
                            onClick={() => fileRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {form.imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={form.imagePreview}
                                        alt="Preview"
                                        className="w-full h-56 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
                                            <Upload className="w-4 h-4" />
                                            Change Image
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-52 gap-3 text-muted-foreground">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-foreground">Drop your image here</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            or click to browse · PNG, JPG, WEBP · max 10 MB
                                        </p>
                                    </div>
                                </div>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Display Order */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Display Order</label>
                            <input
                                type="number"
                                value={form.order}
                                min={0}
                                onChange={(e) => setForm({ ...form, order: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Status</label>
                            <div className="flex gap-2 h-[46px]">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, isActive: true })}
                                    className={`flex-1 rounded-xl border-2 text-sm font-semibold transition-all ${form.isActive
                                        ? "border-green-500 bg-green-500/10 text-green-600"
                                        : "border-border bg-muted/30 text-muted-foreground hover:border-green-400"
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, isActive: false })}
                                    className={`flex-1 rounded-xl border-2 text-sm font-semibold transition-all ${!form.isActive
                                        ? "border-destructive bg-destructive/10 text-destructive"
                                        : "border-border bg-muted/30 text-muted-foreground hover:border-destructive/60"
                                        }`}
                                >
                                    Inactive
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-1">
                        <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={() => onSubmit(form)}
                            disabled={isSubmitting || (!editSlide && !form.imageFile)}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{editSlide ? "Saving…" : "Uploading…"}</>
                            ) : (
                                <><Upload className="w-4 h-4 mr-2" />{editSlide ? "Save Changes" : "Upload Slide"}</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Delete Confirmation Modal
// ─────────────────────────────────────────────────────────────────────────────
const DeleteModal = ({
    slide,
    onConfirm,
    onCancel,
    isDeleting,
}: {
    slide: HeroSlide | null;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}) => {
    if (!slide) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-sm bg-card border border-border/60 rounded-2xl shadow-2xl z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground">Delete Slide?</h3>
                        <p className="text-sm text-muted-foreground">This cannot be undone.</p>
                    </div>
                </div>
                <div className="bg-muted/40 rounded-xl p-3 mb-6 flex items-center gap-3">
                    <img src={slide.imageUrl} alt="Slide" className="w-20 h-14 object-cover rounded-lg border border-border/50" />
                    <div>
                        <p className="text-sm font-semibold text-foreground">Order #{slide.order}</p>
                        <p className="text-xs text-muted-foreground">{slide.isActive ? "Active" : "Inactive"}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isDeleting}>Cancel</Button>
                    <Button
                        className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                        {isDeleting ? "Deleting…" : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Slide Card
// ─────────────────────────────────────────────────────────────────────────────
const SlideCard = ({
    slide,
    onEdit,
    onDelete,
    onToggle,
    isToggling,
}: {
    slide: HeroSlide;
    onEdit: (s: HeroSlide) => void;
    onDelete: (s: HeroSlide) => void;
    onToggle: (s: HeroSlide) => void;
    isToggling: boolean;
}) => (
    <Card className="overflow-hidden border border-border/60 bg-card/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
        <div className="relative aspect-video overflow-hidden">
            <img
                src={slide.imageUrl}
                alt={`Slide ${slide.order}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Order badge */}
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <ArrowUpDown className="w-3 h-3" />
                Order {slide.order}
            </div>

            {/* Status badge — click to toggle active/inactive */}
            <button
                onClick={() => onToggle(slide)}
                disabled={isToggling}
                title={slide.isActive ? "Click to deactivate" : "Click to activate"}
                className="absolute top-3 right-3 z-10"
            >
                <Badge className={`text-xs font-semibold cursor-pointer select-none transition-all duration-200 ${isToggling
                    ? "bg-muted text-muted-foreground"
                    : slide.isActive
                        ? "bg-green-500/90 hover:bg-green-600 text-white shadow-md shadow-green-500/30"
                        : "bg-slate-500/80 hover:bg-slate-600 text-white"
                    }`}>
                    {isToggling ? (
                        <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Updating…</>
                    ) : slide.isActive ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" />Active</>
                    ) : (
                        <><EyeOff className="w-3 h-3 mr-1" />Inactive</>
                    )}
                </Badge>
            </button>
        </div>

        {/* Card actions */}
        <div className="p-4 flex gap-2">
            <Button
                size="sm"
                variant="outline"
                className="flex-1 h-9 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
                onClick={() => onEdit(slide)}
            >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                Edit
            </Button>

            <Button
                size="sm"
                variant="outline"
                className="h-9 px-3 text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(slide)}
            >
                <Trash2 className="w-3.5 h-3.5" />
            </Button>
        </div>
    </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
const HeroImageManagement = () => {
    const navigate = useNavigate();
    const { user, accessToken } = useAppSelector((state) => state.auth);

    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editSlide, setEditSlide] = useState<HeroSlide | null>(null);
    const [deleteSlide, setDeleteSlide] = useState<HeroSlide | null>(null);

    // ── Fetch ────────────────────────────────────────────────────────────────
    const fetchSlides = async () => {
        setIsLoading(true);
        try {
            const res = await heroImageService.getAllHeroImages(accessToken!);
            if (res.success) setSlides(res.data);
        } catch {
            toast.error("Failed to load slides.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!accessToken || user?.accountType !== "Admin") {
            navigate("/dashboard");
            return;
        }
        fetchSlides();
    }, [accessToken, user]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Upload / Edit ─────────────────────────────────────────────────────────
    const handleSubmit = async (form: UploadForm) => {
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("order", form.order);
            fd.append("isActive", String(form.isActive));
            if (form.imageFile) fd.append("image", form.imageFile);

            if (editSlide) {
                const res = await heroImageService.updateHeroImage(editSlide._id, fd, accessToken!);
                if (res.success) {
                    toast.success("Slide updated!");
                    setShowModal(false);
                    setEditSlide(null);
                    fetchSlides();
                }
            } else {
                const res = await heroImageService.uploadHeroImage(fd, accessToken!);
                if (res.success) {
                    toast.success("Slide uploaded!");
                    setShowModal(false);
                    fetchSlides();
                }
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            toast.error(
                axiosErr?.response?.data?.message ||
                (editSlide ? "Failed to update slide." : "Failed to upload slide.")
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteSlide) return;
        setIsDeleting(true);
        try {
            const res = await heroImageService.deleteHeroImage(deleteSlide._id, accessToken!);
            if (res.success) {
                toast.success("Slide deleted.");
                setDeleteSlide(null);
                fetchSlides();
            }
        } catch {
            toast.error("Failed to delete slide.");
        } finally {
            setIsDeleting(false);
        }
    };

    // ── Toggle ────────────────────────────────────────────────────────────────
    const handleToggle = async (slide: HeroSlide) => {
        setTogglingId(slide._id);
        try {
            const res = await heroImageService.toggleHeroImageStatus(slide._id, accessToken!);
            if (res.success) {
                toast.success(`Slide ${res.data.isActive ? "activated" : "deactivated"}.`);
                fetchSlides();
            }
        } catch {
            toast.error("Failed to toggle status.");
        } finally {
            setTogglingId(null);
        }
    };

    const stats = {
        total: slides.length,
        active: slides.filter((s) => s.isActive).length,
        inactive: slides.filter((s) => !s.isActive).length,
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">

                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                                <ImageIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-foreground">Hero Slider Images</h1>
                                <p className="text-muted-foreground text-sm">
                                    Upload images that appear in the hero section slider on the homepage
                                </p>
                            </div>
                        </div>
                        <Button
                            className="h-11 px-6 bg-primary hover:bg-primary/90 rounded-xl font-semibold shadow-md shadow-primary/20 shrink-0"
                            onClick={() => { setEditSlide(null); setShowModal(true); }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Slide
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { label: "Total Slides", value: stats.total, color: "text-foreground" },
                        { label: "Active", value: stats.active, color: "text-green-600" },
                        { label: "Inactive", value: stats.inactive, color: "text-muted-foreground" },
                    ].map((s) => (
                        <Card key={s.label} className="p-5 bg-card/90 border border-border/60">
                            <p className="text-sm text-muted-foreground font-medium mb-1">{s.label}</p>
                            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                        </Card>
                    ))}
                </div>

                {/* Slide grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-muted-foreground">Loading slides…</p>
                    </div>
                ) : slides.length === 0 ? (
                    <Card className="border-2 border-dashed border-primary/20 bg-card/50 flex flex-col items-center justify-center py-24 gap-5">
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-primary/50" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-foreground mb-2">No Slides Yet</h3>
                            <p className="text-muted-foreground max-w-xs">
                                Upload your first image to enable the hero section slider on the homepage.
                            </p>
                        </div>
                        <Button
                            className="mt-2 bg-primary hover:bg-primary/90 rounded-xl px-6"
                            onClick={() => { setEditSlide(null); setShowModal(true); }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload First Slide
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...slides].sort((a, b) => a.order - b.order).map((slide) => (
                            <SlideCard
                                key={slide._id}
                                slide={slide}
                                onEdit={(s) => { setEditSlide(s); setShowModal(true); }}
                                onDelete={(s) => setDeleteSlide(s)}
                                onToggle={handleToggle}
                                isToggling={togglingId === slide._id}
                            />
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            {/* Modals */}
            <SlideModal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditSlide(null); }}
                onSubmit={handleSubmit}
                editSlide={editSlide}
                isSubmitting={isSubmitting}
            />
            <DeleteModal
                slide={deleteSlide}
                onConfirm={handleDelete}
                onCancel={() => setDeleteSlide(null)}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default HeroImageManagement;
