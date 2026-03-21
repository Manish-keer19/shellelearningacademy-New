import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import toast from "react-hot-toast";
import {
  createCertificate,
  getAllCertificates,
  updateCertificateStatus,
  deleteCertificate,
  regenerateQRCode,
  getCertificateStats,
  updateCertificate,
} from "@/service/certificate.service";
import {
  Search,
  Plus,
  Download,
  Eye,
  Ban,
  CheckCircle,
  Trash2,
  RefreshCw,
  FileText,
  Award,
  XCircle,
  AlertCircle,
  Edit,
} from "lucide-react";

interface Certificate {
  _id: string;
  certificateId: string;
  studentName: string;
  studentContact: string;
  courseName: string;
  courseDuration: string;
  issueDate: string;
  status: "VERIFIED" | "REVOKED" | "SUSPENDED";
  qrCodeUrl: string;
  verificationUrl: string;
  certificateFile: {
    url: string;
    fileType: string;
  };
  secondaryCertificateFile?: {
    url: string;
    fileType: string;
  };
  certificateCount: number;
  createdAt: string;
}

interface Stats {
  totalCertificates: number;
  verifiedCertificates: number;
  revokedCertificates: number;
  suspendedCertificates: number;
  thisMonthCertificates: number;
}

const CertificateManagement = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    studentName: "",
    studentContact: "",
    courseName: "",
    courseDuration: "",
    issueDate: new Date().toISOString().split("T")[0],
    remarks: "",
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [secondaryCertificateFile, setSecondaryCertificateFile] =
    useState<File | null>(null);
  const [certificateCount, setCertificateCount] = useState<number>(1);
  const [uploading, setUploading] = useState(false);

  // Fetch certificates
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
        search: searchQuery,
      };

      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }

      const response = await getAllCertificates(params);
      setCertificates(response.data.certificates);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await getCertificateStats();
      setStats(response.data);
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle create certificate
  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certificateFile) {
      toast.error("Please upload a primary certificate file");
      return;
    }

    if (certificateCount === 2 && !secondaryCertificateFile) {
      toast.error("Please upload a secondary certificate file");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Creating certificate...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("studentName", formData.studentName);
      formDataToSend.append("studentContact", formData.studentContact);
      formDataToSend.append("courseName", formData.courseName);
      formDataToSend.append("courseDuration", formData.courseDuration);
      formDataToSend.append("issueDate", formData.issueDate);
      formDataToSend.append("remarks", formData.remarks);
      formDataToSend.append("certificateCount", certificateCount.toString());
      formDataToSend.append("certificateFile", certificateFile);

      if (certificateCount === 2 && secondaryCertificateFile) {
        formDataToSend.append(
          "secondaryCertificateFile",
          secondaryCertificateFile,
        );
      }

      const response = await createCertificate(formDataToSend);

      toast.success(
        `Certificate${certificateCount === 2 ? "s" : ""} created successfully!`,
        { id: toastId },
      );
      setShowCreateModal(false);
      resetForm();
      fetchCertificates();
      fetchStats();

      // Show QR code in a new modal or download
      if (response.data.qrCode) {
        downloadQRCode(
          response.data.qrCode,
          response.data.certificate.certificateId,
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create certificate", {
        id: toastId,
      });
    } finally {
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      studentName: "",
      studentContact: "",
      courseName: "",
      courseDuration: "",
      issueDate: new Date().toISOString().split("T")[0],
      remarks: "",
    });
    setCertificateFile(null);
    setSecondaryCertificateFile(null);
    setCertificateCount(1);
  };

  // Handle edit click
  const handleEditClick = (cert: Certificate) => {
    setFormData({
      studentName: cert.studentName,
      studentContact: cert.studentContact,
      courseName: cert.courseName,
      courseDuration: cert.courseDuration,
      issueDate: new Date(cert.issueDate).toISOString().split("T")[0],
      remarks: "",
    });
    setCertificateCount(cert.certificateCount || 1);
    setEditingCertificate(cert);
    setCertificateFile(null);
    setSecondaryCertificateFile(null);
    setShowEditModal(true);
  };

  // Handle update certificate
  const handleUpdateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCertificate) return;

    setUploading(true);
    const toastId = toast.loading("Updating certificate...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("studentName", formData.studentName);
      formDataToSend.append("studentContact", formData.studentContact);
      formDataToSend.append("courseName", formData.courseName);
      formDataToSend.append("courseDuration", formData.courseDuration);
      formDataToSend.append("issueDate", formData.issueDate);
      formDataToSend.append("remarks", formData.remarks);

      if (certificateFile) {
        formDataToSend.append("certificateFile", certificateFile);
      }

      if (secondaryCertificateFile) {
        formDataToSend.append(
          "secondaryCertificateFile",
          secondaryCertificateFile,
        );
      }

      await updateCertificate(editingCertificate.certificateId, formDataToSend);

      toast.success("Certificate updated successfully!", { id: toastId });
      setShowEditModal(false);
      resetForm();
      setEditingCertificate(null);
      fetchCertificates();
    } catch (error: any) {
      toast.error(error.message || "Failed to update certificate", {
        id: toastId,
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    certificateId: string,
    newStatus: string,
  ) => {
    const reason =
      newStatus === "REVOKED"
        ? prompt("Please enter reason for revocation:")
        : undefined;

    if (newStatus === "REVOKED" && !reason) {
      return;
    }

    const toastId = toast.loading("Updating status...");

    try {
      await updateCertificateStatus(certificateId, newStatus, reason);
      toast.success("Status updated successfully!", { id: toastId });
      fetchCertificates();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status", { id: toastId });
    }
  };

  // Handle delete
  const handleDelete = async (certificateId: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) {
      return;
    }

    const toastId = toast.loading("Deleting certificate...");

    try {
      await deleteCertificate(certificateId);
      toast.success("Certificate deleted successfully!", { id: toastId });
      fetchCertificates();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete certificate", {
        id: toastId,
      });
    }
  };

  // Handle regenerate QR
  const handleRegenerateQR = async (certificateId: string) => {
    const toastId = toast.loading("Regenerating QR code...");

    try {
      const response = await regenerateQRCode(certificateId);
      toast.success("QR code regenerated!", { id: toastId });
      downloadQRCode(response.data.qrCodeUrl, certificateId);
    } catch (error: any) {
      toast.error(error.message || "Failed to regenerate QR code", {
        id: toastId,
      });
    }
  };

  // Download QR code
  const downloadQRCode = (dataUrl: string, certificateId: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `QR-${certificateId}.png`;
    link.click();
  };

  // View certificate
  const viewCertificate = (certificateId: string) => {
    window.open(`/certificate/${certificateId}`, "_blank");
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles = {
      VERIFIED: "bg-green-100 text-green-800 border-green-200",
      REVOKED: "bg-red-100 text-red-800 border-red-200",
      SUSPENDED: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    const icons = {
      VERIFIED: <CheckCircle className="w-3 h-3" />,
      REVOKED: <XCircle className="w-3 h-3" />,
      SUSPENDED: <AlertCircle className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
          styles[status as keyof typeof styles]
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              Certificate Management
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage and verify student certificates for Shell E-Learning
              Academy
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Total
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {stats.totalCertificates}
                    </p>
                  </div>
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary opacity-20" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Verified
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {stats.verifiedCertificates}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 opacity-20" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Revoked
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">
                      {stats.revokedCertificates}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 opacity-20" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Suspended
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                      {stats.suspendedCertificates}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 opacity-20" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      This Month
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      {stats.thisMonthCertificates}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary opacity-20" />
                </div>
              </div>
            </div>
          )}

          {/* Filters and Actions */}
          <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-border">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              >
                <option value="ALL">All Status</option>
                <option value="VERIFIED">Verified</option>
                <option value="REVOKED">Revoked</option>
                <option value="SUSPENDED">Suspended</option>
              </select>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-all shadow-md hover:shadow-lg text-sm font-semibold"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Certificate</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-muted opacity-30 mx-auto mb-4" />
                <p className="text-muted-foreground">No certificates found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Certificate ID
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                        Student
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                        Course
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                        Issue Date
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {certificates.map((cert) => (
                      <tr
                        key={cert._id}
                        className="hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className="font-mono text-xs sm:text-sm font-semibold text-primary">
                            {cert.certificateId}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {cert.studentName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {cert.studentContact}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {cert.courseName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {cert.courseDuration}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground hidden xl:table-cell">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          {getStatusBadge(cert.status)}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() =>
                                viewCertificate(cert.certificateId)
                              }
                              className="p-1.5 sm:p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="View Certificate"
                            >
                              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleEditClick(cert)}
                              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hidden sm:block"
                              title="Edit Certificate"
                            >
                              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() =>
                                downloadQRCode(
                                  cert.qrCodeUrl,
                                  cert.certificateId,
                                )
                              }
                              className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download QR Code"
                            >
                              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleRegenerateQR(cert.certificateId)
                              }
                              className="p-1.5 sm:p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors hidden sm:block"
                              title="Regenerate QR"
                            >
                              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            {cert.status === "VERIFIED" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    cert.certificateId,
                                    "REVOKED",
                                  )
                                }
                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hidden sm:block"
                                title="Revoke Certificate"
                              >
                                <Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            )}
                            {cert.status === "REVOKED" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    cert.certificateId,
                                    "VERIFIED",
                                  )
                                }
                                className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors hidden sm:block"
                                title="Verify Certificate"
                              >
                                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(cert.certificateId)}
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hidden sm:block"
                              title="Delete Certificate"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t border-border flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Certificate Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
                Add New Certificate
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form
              onSubmit={handleCreateCertificate}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="Enter student name"
                />
              </div>

              {/* Student Contact */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Student Email or Mobile *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentContact}
                  onChange={(e) =>
                    setFormData({ ...formData, studentContact: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="email@example.com or +91 1234567890"
                />
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseName}
                  onChange={(e) =>
                    setFormData({ ...formData, courseName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="e.g., Digital Marketing"
                />
              </div>

              {/* Course Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course Duration *
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseDuration}
                  onChange={(e) =>
                    setFormData({ ...formData, courseDuration: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="e.g., 3 Months"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                />
              </div>

              {/* Certificate Count */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Number of Certificates *
                </label>
                <select
                  value={certificateCount}
                  onChange={(e) =>
                    setCertificateCount(parseInt(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                >
                  <option value={1}>1 Certificate</option>
                  <option value={2}>2 Certificates</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Select how many certificates to assign to this student
                </p>
              </div>

              {/* Primary Certificate File */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {certificateCount === 2
                    ? "Primary Certificate File *"
                    : "Certificate File (PDF or Image) *"}
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setCertificateFile(e.target.files?.[0] || null)
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted formats: PDF, JPG, PNG (Max 5MB)
                </p>
              </div>

              {/* Secondary Certificate File (Conditional) */}
              {certificateCount === 2 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Secondary Certificate File *
                  </label>
                  <input
                    type="file"
                    required={certificateCount === 2}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setSecondaryCertificateFile(e.target.files?.[0] || null)
                    }
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload the second certificate for this student
                  </p>
                </div>
              )}

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="Any additional notes..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  {uploading ? "Creating..." : "Create Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Certificate Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
                Edit Certificate
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCertificate(null);
                  resetForm();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateCertificate}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="Enter student name"
                />
              </div>

              {/* Student Contact */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Student Email or Mobile *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentContact}
                  onChange={(e) =>
                    setFormData({ ...formData, studentContact: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="email@example.com or +91 1234567890"
                />
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseName}
                  onChange={(e) =>
                    setFormData({ ...formData, courseName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="e.g., Digital Marketing"
                />
              </div>

              {/* Course Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course Duration *
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseDuration}
                  onChange={(e) =>
                    setFormData({ ...formData, courseDuration: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="e.g., 3 Months"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                  placeholder="Any additional notes..."
                />
              </div>

              {/* Primary Certificate File */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Primary Certificate File (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setCertificateFile(e.target.files?.[0] || null)
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to keep existing file. Accepted formats: PDF, JPG,
                  PNG (Max 5MB)
                </p>
              </div>

              {/* Secondary Certificate File */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Secondary Certificate File (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setSecondaryCertificateFile(e.target.files?.[0] || null)
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload if there's a second certificate for this student. Needs
                  to be a valid file.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCertificate(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  {uploading ? "Updating..." : "Update Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateManagement;
