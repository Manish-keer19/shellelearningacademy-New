import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserCertificates } from "@/service/certificate.service";
import {
    Award,
    Download,
    Calendar,
    BookOpen,
    Clock,
    FileText,
    Shield,
} from "lucide-react";
import logo from "../assets/logo2.png";

interface CertificateData {
    certificateId: string;
    studentName: string;
    studentContact: string;
    courseName: string;
    courseDuration: string;
    issueDate: string;
    status: "VERIFIED" | "REVOKED" | "SUSPENDED";
    certificateFile: {
        url: string;
        fileType: string;
    };
    verificationUrl: string;
}

interface UserData {
    fullName: string;
    email: string;
}

const UserCertificates = () => {
    const { userEmail } = useParams<{ userEmail: string }>();
    const [certificates, setCertificates] = useState<CertificateData[]>([]);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userEmail) {
            fetchUserCertificates();
        }
    }, [userEmail]);

    const fetchUserCertificates = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getUserCertificates(userEmail!);
            setCertificates(response.data.certificates);
            setUserData(response.data.user);
        } catch (err: any) {
            setError(err.message || "Failed to fetch certificates");
        } finally {
            setLoading(false);
        }
    };

    const downloadCertificate = (url: string) => {
        window.open(url, "_blank");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground text-lg">Loading certificates...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-card rounded-2xl shadow-2xl p-8 text-center border-2 border-red-200">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award className="w-12 h-12 text-red-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">
                            Error Loading Certificates
                        </h1>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <a
                            href="/"
                            className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                            Go to Homepage
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <img
                            src={logo}
                            alt="Shell E-Learning Academy"
                            className="h-16 w-16 object-contain"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
                        My Certificates
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Shell E-Learning Academy
                    </p>
                    {userData && (
                        <div className="mt-4 inline-block bg-card px-6 py-3 rounded-lg shadow-sm border border-border">
                            <p className="text-sm text-muted-foreground">Student</p>
                            <p className="text-lg font-semibold text-foreground">{userData.fullName}</p>
                            <p className="text-sm text-muted-foreground">{userData.email}</p>
                        </div>
                    )}
                </div>

                {/* Certificates Count */}
                <div className="mb-8">
                    <div className="bg-card rounded-xl shadow-sm p-6 border border-border text-center">
                        <Award className="w-12 h-12 text-primary mx-auto mb-3" />
                        <h2 className="text-2xl font-bold text-foreground mb-1">
                            {certificates.length} {certificates.length === 1 ? "Certificate" : "Certificates"}
                        </h2>
                        <p className="text-muted-foreground">
                            Verified and issued by Shell E-Learning Academy
                        </p>
                    </div>
                </div>

                {/* Certificates Grid */}
                {certificates.length === 0 ? (
                    <div className="text-center py-12">
                        <Award className="w-20 h-20 text-muted opacity-30 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">No certificates found</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {certificates.map((cert) => (
                            <div
                                key={cert.certificateId}
                                className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow"
                            >
                                {/* Certificate Header */}
                                <div className="bg-primary px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-primary-foreground/80 text-xs mb-1">
                                                Certificate ID
                                            </p>
                                            <p className="text-primary-foreground text-lg font-bold font-mono">
                                                {cert.certificateId}
                                            </p>
                                        </div>
                                        <Shield className="w-12 h-12 text-primary-foreground opacity-30" />
                                    </div>
                                </div>

                                {/* Certificate Body */}
                                <div className="p-6">
                                    {/* Course Details */}
                                    <div className="mb-6">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <BookOpen className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Course</p>
                                                <p className="text-base font-semibold text-foreground">
                                                    {cert.courseName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Clock className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {cert.courseDuration}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Calendar className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Issued</p>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {new Date(cert.issueDate).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Certificate Preview */}
                                    <div className="bg-secondary/30 rounded-xl p-4 mb-4 border-2 border-border">
                                        {cert.certificateFile.fileType === "pdf" ? (
                                            <div className="aspect-[1.414/1] bg-card rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
                                                    <p className="text-muted-foreground text-sm">PDF Certificate</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={cert.certificateFile.url}
                                                alt="Certificate"
                                                className="w-full h-auto rounded-lg shadow-md object-contain"
                                                style={{ maxHeight: '300px' }}
                                            />
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => downloadCertificate(cert.certificateFile.url)}
                                            className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => window.open(`/certificate/${cert.certificateId}`, "_blank")}
                                            className="px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition-colors font-medium"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 text-center">
                    <div className="inline-block bg-card rounded-xl shadow-md px-8 py-4 border border-border">
                        <p className="text-muted-foreground text-sm mb-1">
                            Verified & Issued by
                        </p>
                        <p className="text-foreground font-bold text-lg">
                            Shell E-Learning Academy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCertificates;
