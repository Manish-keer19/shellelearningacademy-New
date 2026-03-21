import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Lock,
    Camera,
    Loader2,
    CheckCircle,
    Eye,
    EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { userService } from "@/service/user.service";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "@/store/authSlice";

const Settings = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, accessToken, isLoading: authLoading } = useAppSelector(
        (state) => state.auth
    );
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        about: "",
        dateOfBirth: "",
        gender: "",
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (authLoading) return;

        if (!accessToken) {
            navigate("/auth");
            return;
        }

        // Load user data into form
        if (user) {
            setProfileForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                contactNumber: user.additionalDetails?.contactNumber || "",
                about: user.additionalDetails?.about || "",
                dateOfBirth: user.additionalDetails?.dateOfBirth || "",
                gender: user.additionalDetails?.gender || "",
            });
            setImagePreview(user.image || "");
        }
    }, [accessToken, user, navigate, authLoading]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                toast.error("Image size should be less than 5MB");
                return;
            }
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await userService.updateProfile(profileForm, accessToken);

            if (response.success) {
                toast.success("Profile updated successfully");
                // Update Redux store with new user data
                dispatch(
                    loginSuccess({
                        user: response.userDetails,
                        accessToken: accessToken,
                    })
                );
            }
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfilePicture = async () => {
        if (!profileImage) {
            toast.error("Please select an image");
            return;
        }

        setIsLoading(true);

        try {
            const response = await userService.updateProfilePicture(
                profileImage,
                accessToken
            );

            if (response.success) {
                toast.success("Profile picture updated successfully");
                // Update Redux store with new image
                dispatch(
                    loginSuccess({
                        user: response.data,
                        accessToken: accessToken,
                    })
                );
                setProfileImage(null);
            }
        } catch (error: any) {
            console.error("Error updating profile picture:", error);
            toast.error(
                error.response?.data?.message || "Failed to update profile picture"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);

        try {
            const response = await userService.updatePassword(
                {
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                },
                accessToken
            );

            if (response.success) {
                toast.success("Password updated successfully");
                // Reset form
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error: any) {
            console.error("Error updating password:", error);
            toast.error(
                error.response?.data?.message || "Failed to update password"
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading screen while auth is being checked
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
                    <p className="text-muted-foreground">Please wait</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-foreground">
                        Account <span className="text-primary">Settings</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Manage your profile and security settings
                    </p>
                </div>

                {/* Main Content - Tabs */}
                <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Profile & Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 mb-8">
                                <TabsTrigger value="profile" className="text-base">
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="password" className="text-base">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Password
                                </TabsTrigger>
                            </TabsList>

                            {/* Tab 1: Profile Settings */}
                            <TabsContent value="profile">
                                <div className="space-y-8">
                                    {/* Profile Picture Section */}
                                    <div className="flex flex-col items-center space-y-4 pb-8 border-b border-border">
                                        <Avatar className="w-32 h-32">
                                            <AvatarImage src={imagePreview} alt={user?.fullName} />
                                            <AvatarFallback className="text-3xl">
                                                {user?.fullName?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col items-center space-y-2">
                                            <Label
                                                htmlFor="profile-picture"
                                                className="cursor-pointer"
                                            >
                                                <div className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                                                    <Camera className="w-4 h-4" />
                                                    <span className="text-sm font-medium">
                                                        Choose Image
                                                    </span>
                                                </div>
                                                <Input
                                                    id="profile-picture"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </Label>

                                            {profileImage && (
                                                <Button
                                                    onClick={handleUpdateProfilePicture}
                                                    disabled={isLoading}
                                                    className="w-full max-w-xs"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Update Picture
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Max file size: 5MB. Supported formats: JPG, PNG, GIF
                                        </p>
                                    </div>

                                    {/* Profile Form */}
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* First Name */}
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    type="text"
                                                    placeholder="Enter first name"
                                                    value={profileForm.firstName}
                                                    onChange={(e) =>
                                                        setProfileForm({
                                                            ...profileForm,
                                                            firstName: e.target.value,
                                                        })
                                                    }
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Last Name */}
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    type="text"
                                                    placeholder="Enter last name"
                                                    value={profileForm.lastName}
                                                    onChange={(e) =>
                                                        setProfileForm({
                                                            ...profileForm,
                                                            lastName: e.target.value,
                                                        })
                                                    }
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Email (Read-only) */}
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileForm.email}
                                                    disabled
                                                    className="h-11 bg-muted"
                                                />
                                            </div>

                                            {/* Contact Number */}
                                            <div className="space-y-2">
                                                <Label htmlFor="contactNumber">Contact Number</Label>
                                                <Input
                                                    id="contactNumber"
                                                    type="tel"
                                                    placeholder="Enter contact number"
                                                    value={profileForm.contactNumber}
                                                    onChange={(e) =>
                                                        setProfileForm({
                                                            ...profileForm,
                                                            contactNumber: e.target.value,
                                                        })
                                                    }
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Date of Birth */}
                                            <div className="space-y-2">
                                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                                <Input
                                                    id="dateOfBirth"
                                                    type="date"
                                                    value={profileForm.dateOfBirth}
                                                    onChange={(e) =>
                                                        setProfileForm({
                                                            ...profileForm,
                                                            dateOfBirth: e.target.value,
                                                        })
                                                    }
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div className="space-y-2">
                                                <Label htmlFor="gender">Gender</Label>
                                                <Input
                                                    id="gender"
                                                    type="text"
                                                    placeholder="Enter gender"
                                                    value={profileForm.gender}
                                                    onChange={(e) =>
                                                        setProfileForm({
                                                            ...profileForm,
                                                            gender: e.target.value,
                                                        })
                                                    }
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* About */}
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="about">About</Label>
                                                <textarea
                                                    id="about"
                                                    placeholder="Tell us about yourself"
                                                    value={profileForm.about}
                                                    onChange={(e) =>
                                                        setProfileForm({
                                                            ...profileForm,
                                                            about: e.target.value,
                                                        })
                                                    }
                                                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Updating Profile...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                    Update Profile
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </TabsContent>

                            {/* Tab 2: Password Settings */}
                            <TabsContent value="password">
                                <form onSubmit={handleUpdatePassword} className="space-y-6">
                                    <div className="space-y-6">
                                        {/* Current Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">
                                                Current Password <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="currentPassword"
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    placeholder="Enter current password"
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            currentPassword: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    className="h-11 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCurrentPassword(!showCurrentPassword)
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">
                                                New Password <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    placeholder="Enter new password (min 6 characters)"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            newPassword: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    className="h-11 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">
                                                Confirm New Password{" "}
                                                <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Re-enter new password"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) =>
                                                    setPasswordForm({
                                                        ...passwordForm,
                                                        confirmPassword: e.target.value,
                                                    })
                                                }
                                                required
                                                className="h-11"
                                            />
                                        </div>

                                        {/* Password Requirements */}
                                        <Card className="bg-muted/50 border-border/50">
                                            <CardContent className="p-4">
                                                <p className="text-sm font-medium mb-2">
                                                    Password Requirements:
                                                </p>
                                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                                    <li>At least 6 characters long</li>
                                                    <li>Must be different from current password</li>
                                                    <li>Confirm password must match new password</li>
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Updating Password...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5 mr-2" />
                                                Update Password
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
};

export default Settings;
