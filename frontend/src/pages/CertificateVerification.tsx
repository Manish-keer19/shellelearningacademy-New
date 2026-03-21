import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { verifyCertificate } from "@/service/certificate.service";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    Shield,
    Calendar,
    User,
    BookOpen,
    Clock,
    Award,
    FileText,
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
    secondaryCertificateFile?: {
        url: string;
        fileType: string;
    };
    certificateCount: number;
    verificationUrl: string;
}

const CertificateVerification = () => {
    const { certificateId } = useParams<{ certificateId: string }>();
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (certificateId) {
            fetchCertificate();
        }
    }, [certificateId]);

    const fetchCertificate = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await verifyCertificate(certificateId!);
            setCertificate(response.data.certificate);
            setIsValid(response.data.isValid);
        } catch (err: any) {
            setError(err.message || "Certificate not found or invalid");
        } finally {
            setLoading(false);
        }
    };

    const downloadCertificate = () => {
        if (certificate?.certificateFile.url) {
            window.open(certificate.certificateFile.url, "_blank");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground text-base sm:text-lg">Verifying certificate...</p>
                </div>
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-card rounded-2xl shadow-2xl p-6 sm:p-8 text-center border-2 border-red-200">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                            Certificate Not Found
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
                            {error || "The certificate you're looking for doesn't exist or has been removed."}
                        </p>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                            <p className="text-xs sm:text-sm text-red-800 font-medium break-all">
                                Certificate ID: {certificateId}
                            </p>
                        </div>
                        <a
                            href="/"
                            className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-all shadow-md hover:shadow-lg text-sm font-semibold"
                        >
                            Go to Homepage
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusDisplay = () => {
        if (certificate.status === "VERIFIED") {
            return {
                icon: <CheckCircle className="w-16 h-16 text-green-600" />,
                bgColor: "bg-green-100",
                borderColor: "border-green-200",
                textColor: "text-green-800",
                title: "✓ This Certificate is Verified",
                description: "This certificate is authentic and has been issued by Shell E-Learning Academy.",
            };
        } else if (certificate.status === "REVOKED") {
            return {
                icon: <XCircle className="w-16 h-16 text-red-600" />,
                bgColor: "bg-red-100",
                borderColor: "border-red-200",
                textColor: "text-red-800",
                title: "✗ This Certificate has been Revoked",
                description: "This certificate is no longer valid and has been revoked by the issuing authority.",
            };
        } else {
            return {
                icon: <AlertCircle className="w-16 h-16 text-yellow-600" />,
                bgColor: "bg-yellow-100",
                borderColor: "border-yellow-200",
                textColor: "text-yellow-800",
                title: "⚠ This Certificate is Suspended",
                description: "This certificate is currently under review and temporarily suspended.",
            };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-8 sm:py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="flex items-center justify-center mb-4 sm:mb-6">
                        <img
                            src={logo}
                            alt="Shell E-Learning Academy"
                            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                        />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 sm:mb-3">
                        Certificate Verification
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg">
                        Shell E-Learning Academy
                    </p>
                </div>

                {/* Verification Status */}
                <div
                    className={`${statusDisplay.bgColor} ${statusDisplay.borderColor} border-2 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-center shadow-lg`}
                >
                    <div className="flex justify-center mb-3 sm:mb-4">{statusDisplay.icon}</div>
                    <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold ${statusDisplay.textColor} mb-2 sm:mb-3`}>
                        {statusDisplay.title}
                    </h2>
                    <p className={`${statusDisplay.textColor} text-sm sm:text-base md:text-lg`}>
                        {statusDisplay.description}
                    </p>
                </div>

                {/* Certificate Details */}
                <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border mb-6 sm:mb-8">
                    {/* Certificate ID Header */}
                    <div className="bg-primary px-6 sm:px-8 py-5 sm:py-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-primary-foreground/80 text-xs sm:text-sm mb-1">Certificate ID</p>
                                <p className="text-primary-foreground text-xl sm:text-2xl md:text-3xl font-bold font-mono break-all">
                                    {certificate.certificateId}
                                </p>
                            </div>
                            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-primary-foreground opacity-30" />
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            Student Details
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Student Name</p>
                                    <p className="text-base sm:text-lg font-semibold text-foreground">
                                        {certificate.studentName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Issue Date</p>
                                    <p className="text-base sm:text-lg font-semibold text-foreground">
                                        {new Date(certificate.issueDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Course Details */}
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            Course Details
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Course Name</p>
                                    <p className="text-base sm:text-lg font-semibold text-foreground">
                                        {certificate.courseName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Course Duration</p>
                                    <p className="text-base sm:text-lg font-semibold text-foreground">
                                        {certificate.courseDuration}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Preview */}
                        {certificate.status === "VERIFIED" && (
                            <>
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
                                    Certificate Preview{certificate.certificateCount === 2 ? 's' : ''}
                                </h3>

                                {/* Primary Certificate */}
                                <div className="mb-6">
                                    {certificate.certificateCount === 2 && (
                                        <h4 className="text-base sm:text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-primary" />
                                            Primary Certificate
                                        </h4>
                                    )}
                                    <div className="bg-secondary/30 rounded-xl p-4 mb-4 sm:mb-6 border-2 border-border">
                                        {certificate.certificateFile.fileType === "pdf" ? (
                                            <div className="aspect-[1.414/1] bg-card rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-muted-foreground text-sm sm:text-base mb-4">PDF Certificate</p>
                                                    <button
                                                        onClick={() => window.open(certificate.certificateFile.url, "_blank")}
                                                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 text-sm font-semibold"
                                                    >
                                                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        Download Certificate
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={certificate.certificateFile.url}
                                                alt="Primary Certificate"
                                                className="w-full max-w-3xl mx-auto h-auto rounded-lg shadow-lg object-contain"
                                                style={{ maxHeight: '600px' }}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Secondary Certificate */}
                                {certificate.certificateCount === 2 && certificate.secondaryCertificateFile && (
                                    <div className="mb-6">
                                        <h4 className="text-base sm:text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-primary" />
                                            Secondary Certificate
                                        </h4>
                                        <div className="bg-secondary/30 rounded-xl p-4 mb-4 sm:mb-6 border-2 border-border">
                                            {certificate.secondaryCertificateFile.fileType === "pdf" ? (
                                                <div className="aspect-[1.414/1] bg-card rounded-lg flex items-center justify-center">
                                                    <div className="text-center">
                                                        <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mx-auto mb-4" />
                                                        <p className="text-muted-foreground text-sm sm:text-base mb-4">PDF Certificate</p>
                                                        <button
                                                            onClick={() => window.open(certificate.secondaryCertificateFile!.url, "_blank")}
                                                            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 text-sm font-semibold"
                                                        >
                                                            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                                            Download Certificate
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={certificate.secondaryCertificateFile.url}
                                                    alt="Secondary Certificate"
                                                    className="w-full max-w-3xl mx-auto h-auto rounded-lg shadow-lg object-contain"
                                                    style={{ maxHeight: '600px' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Download Button */}
                                <button
                                    onClick={downloadCertificate}
                                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold"
                                >
                                    <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                                    Download {certificate.certificateCount === 2 ? 'Primary ' : ''}Certificate
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <div className="inline-block bg-card rounded-xl shadow-md px-6 sm:px-8 py-3 sm:py-4 border border-border">
                        <p className="text-muted-foreground text-xs sm:text-sm mb-1">
                            Verified & Issued by
                        </p>
                        <p className="text-foreground font-bold text-base sm:text-lg">
                            Shell E-Learning Academy
                        </p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 sm:mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold text-primary text-sm sm:text-base mb-2">
                                Security Notice
                            </h4>
                            <p className="text-foreground/80 text-xs sm:text-sm">
                                This is an official verification page. The certificate ID and all details
                                shown here are authentic and verified against our secure database. If you
                                have any concerns about the authenticity of this certificate, please
                                contact Shell E-Learning Academy directly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateVerification;
