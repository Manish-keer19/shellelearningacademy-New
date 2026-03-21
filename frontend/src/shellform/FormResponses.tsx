import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Download, 
  Loader2, 
  User,
  Calendar,
  Layers,
  BarChart3,
  Table as TableIcon,
  MessageSquare
} from "lucide-react";
import { shellFormService } from "@/service/shellform.service";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const FormResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'analytics'>('list');

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [formRes, resRes] = await Promise.all([
        shellFormService.getFormById(id!),
        shellFormService.getResponses(id!)
      ]);
      setForm(formRes.data);
      setResponses(resRes.data.responses || []);
    } catch (error: any) {
      toast.error("Failed to load responses");
      navigate("/admin/forms");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (responses.length === 0) return;
    
    // Prepare headers
    const headers = ["Submission Date"];
    form.questions.forEach((q: any) => headers.push(q.questionText));
    
    // Prepare rows
    const rows = responses.map(sub => {
      const row = [new Date(sub.createdAt).toLocaleString()];
      form.questions.forEach((q: any) => {
        const ans = sub.answers.find((r: any) => r.questionId && (r.questionId._id === q._id || r.questionId === q._id));
        const answerVal = ans ? (Array.isArray(ans.value) ? ans.value.join(', ') : ans.value) : '';
        row.push(`"${String(answerVal).replace(/"/g, '""')}"`);
      });
      return row.join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.title}_Responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/5">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/forms")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{form.title}</h1>
              <p className="text-muted-foreground">{responses.length} responses collected</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/5">
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
          </div>
        </div>

        {responses.length === 0 ? (
          <Card className="bg-card py-20 text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No responses yet</h3>
            <p className="text-muted-foreground">Share your form link to start collecting responses.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex bg-card p-1 rounded-xl w-fit border border-border">
              <Button 
                variant={view === 'list' ? 'secondary' : 'ghost'} 
                onClick={() => setView('list')}
                className="flex items-center gap-2"
              >
                <TableIcon className="w-4 h-4" />
                Individual Responses
              </Button>
              {/* <Button 
                variant={view === 'analytics' ? 'secondary' : 'ghost'} 
                onClick={() => setView('analytics')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button> */}
            </div>

            <div className="space-y-4">
              {responses.map((sub, index) => (
                <motion.div
                  key={sub._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                        <div className="flex items-center gap-2 text-primary font-bold">
                          <User className="w-4 h-4" />
                          Response #{responses.length - index}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(sub.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {form.questions.map((q: any) => {
                          const ans = sub.answers.find((r: any) => r.questionId && (r.questionId._id === q._id || r.questionId === q._id));
                          return (
                            <div key={q._id} className="space-y-1">
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{q.questionText}</p>
                              <p className="text-foreground font-medium">
                                {ans ? (
                                  q.questionType === 'file_upload' || q.questionType === 'file' || (typeof ans.value === 'string' && ans.value.startsWith('http')) ? (
                                    <div className="flex gap-2 items-center">
                                      <a 
                                        href={ans.value} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="text-primary hover:underline flex items-center gap-1 w-fit bg-primary/5 px-3 py-1 rounded-lg border border-primary/20 text-sm"
                                      >
                                        View File
                                      </a>
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          let downUrl = ans.value;
                                          // Add fl_attachment flag for cloudinary URLs to force download
                                          if (downUrl.includes('cloudinary.com') && downUrl.includes('/upload/')) {
                                              if (!downUrl.includes('fl_attachment')) {
                                                const fileNameExp = downUrl.split('/').pop() || 'download';
                                                downUrl = downUrl.replace('/upload/', `/upload/fl_attachment:${fileNameExp}/`);
                                              }
                                          }
                                          const link = document.createElement('a');
                                          link.href = downUrl;
                                          link.setAttribute('download', ans.value.split('/').pop() || 'file');
                                          link.setAttribute('target', '_blank');
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                        }}
                                        className="text-primary hover:underline flex items-center gap-1 w-fit bg-primary/5 px-3 py-1 rounded-lg border border-primary/20 text-sm"
                                      >
                                        Download <Download className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    Array.isArray(ans.value) ? ans.value.join(', ') : String(ans.value)
                                  )
                                ) : <span className="text-muted-foreground/30 italic">No answer</span>}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FormResponses;
