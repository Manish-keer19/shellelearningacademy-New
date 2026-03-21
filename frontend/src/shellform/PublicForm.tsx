import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  CheckCircle2, 
  Send, 
  AlertCircle,
  Star,
  ChevronDown,
  Upload,
  FileCheck,
  X
} from "lucide-react";
import { shellFormService } from "@/service/shellform.service";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchForm();
  }, [slug]);

  const fetchForm = async () => {
    setLoading(true);
    try {
      const response = await shellFormService.getPublicForm(slug!);
      setForm(response.data);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Form not found or closed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  const handleFileUpload = async (questionId: string, file: File) => {
    if (!file) return;
    
    setUploadingFiles(prev => ({ ...prev, [questionId]: true }));
    try {
      const response = await shellFormService.uploadFormFile(file);
      handleInputChange(questionId, response.url);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploadingFiles(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form) return;

    // Validate required questions
    const missing = form.questions.filter((q: any) => q.required && (!responses[q._id] || (Array.isArray(responses[q._id]) && responses[q._id].length === 0)));
    if (missing.length > 0) {
      toast.error(`Please answer required question: ${missing[0].questionText}`);
      const element = document.getElementById(missing[0]._id);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value: value
      }));
      
      await shellFormService.submitPublicForm(slug!, formattedAnswers);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium tracking-tight">Loading form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
        <div className="bg-card border border-border p-6 md:p-10 rounded-2xl shadow-sm max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-destructive/80 mx-auto mb-6" />
          <h1 className="text-xl font-bold mb-2">Form Unavailable</h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{error}</p>
          <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full rounded-xl">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border p-8 md:p-12 rounded-2xl shadow-sm max-w-lg w-full text-center"
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Response Received</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
            {form.thankYouMessage || "Your information has been successfully recorded. Thank you for your time."}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="px-8 rounded-xl">
            Submit Another Response
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-10 md:py-20 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Form Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="h-2 bg-primary" />
            <div className="p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight">{form.title}</h1>
              {form.description && <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">{form.description}</p>}
              
              <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                   <span>Powered by</span> 
                   <span className="font-bold text-foreground opacity-80 uppercase tracking-widest text-[10px]">ShellForms</span>
                </div>
                {form.questions.some((q: any) => q.required) && (
                  <span className="text-destructive/80 text-[11px] font-bold uppercase tracking-widest bg-destructive/5 px-2 py-0.5 rounded">
                    * Required fields
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <AnimatePresence>
            {form.questions.map((question: any, index: number) => (
              <motion.div
                key={question._id}
                id={question._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm transition-all hover:border-border/80">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-start gap-1">
                        <label className="text-base md:text-lg font-semibold text-foreground leading-snug">
                          {question.questionText}
                        </label>
                        {question.required && <span className="text-destructive font-bold text-sm leading-none mt-1">*</span>}
                      </div>
                    </div>

                    <div className="pt-2">
                      {/* Text/Email/Phone/Number Inputs */}
                      {(['short_text', 'paragraph', 'email', 'phone', 'number', 'date'].includes(question.questionType)) && (
                        <Input 
                          type={
                            question.questionType === 'email' ? 'email' : 
                            question.questionType === 'number' ? 'number' : 
                            question.questionType === 'date' ? 'date' : 
                            question.questionType === 'phone' ? 'tel' : 'text'
                          }
                          required={question.required}
                          value={responses[question._id] || ''}
                          onChange={(e) => handleInputChange(question._id, e.target.value)}
                          className="bg-muted/30 border-border focus:bg-background focus:ring-1 focus:ring-primary/20 focus:border-primary h-12 text-base rounded-xl transition-all"
                          placeholder="Your answer"
                        />
                      )}

                      {/* Long Text */}
                      {question.questionType === 'long_text' && (
                        <Textarea 
                          required={question.required}
                          value={responses[question._id] || ''}
                          onChange={(e) => handleInputChange(question._id, e.target.value)}
                          className="bg-muted/30 border-border focus:bg-background focus:ring-1 focus:ring-primary/20 focus:border-primary text-base min-h-[140px] rounded-xl transition-all resize-none p-4"
                          placeholder="Type your detailed response here..."
                        />
                      )}

                      {/* Radio / Single Choice */}
                      {question.questionType === 'radio' && (
                        <RadioGroup 
                          onValueChange={(val) => handleInputChange(question._id, val)}
                          value={responses[question._id]}
                          className="space-y-3"
                        >
                          {question.options.map((opt: any) => (
                            <div key={opt.value} className="flex items-center space-x-3 group cursor-pointer">
                              <RadioGroupItem 
                                value={opt.value} 
                                id={`opt-${opt.value}-${question._id}`} 
                                className="border-border text-primary"
                              />
                              <Label 
                                htmlFor={`opt-${opt.value}-${question._id}`} 
                                className="text-base font-medium cursor-pointer flex-grow py-1 transition-colors group-hover:text-primary"
                              >
                                {opt.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {/* Checkbox / Multiple Choice */}
                      {(question.questionType === 'checkbox' || question.questionType === 'multiple_choice') && (
                        <div className="space-y-3">
                          {question.options.map((opt: any) => {
                            const isChecked = (responses[question._id] || []).includes(opt.value);
                            return (
                              <div key={opt.value} className="flex items-center space-x-3 group cursor-pointer">
                                <Checkbox 
                                  id={`chk-${opt.value}-${question._id}`} 
                                  onCheckedChange={(checked) => {
                                    const currentValues = responses[question._id] || [];
                                    if (checked) {
                                      handleInputChange(question._id, [...currentValues, opt.value]);
                                    } else {
                                      handleInputChange(question._id, currentValues.filter((v: string) => v !== opt.value));
                                    }
                                  }}
                                  checked={isChecked}
                                  className="border-border data-[state=checked]:bg-primary"
                                />
                                <Label 
                                  htmlFor={`chk-${opt.value}-${question._id}`} 
                                  className="text-base font-medium cursor-pointer flex-grow py-1 transition-colors group-hover:text-primary"
                                >
                                  {opt.label}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Rating */}
                      {question.questionType === 'rating' && (
                        <div className="flex gap-1.5 flex-wrap">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleInputChange(question._id, star)}
                              className={`p-2 transition-all ${responses[question._id] >= star ? 'text-yellow-500 scale-110' : 'text-muted-foreground/20 hover:text-yellow-500/40'}`}
                            >
                              <Star className={`w-8 h-8 md:w-10 md:h-10 ${responses[question._id] >= star ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Dropdown */}
                      {question.questionType === 'dropdown' && (
                        <div className="relative">
                          <select 
                            required={question.required}
                            value={responses[question._id] || ''}
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                            className="w-full bg-muted/30 border border-border rounded-xl outline-none px-4 h-12 text-base focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer pr-10"
                          >
                            <option value="" disabled>Choose an option</option>
                            {question.options.map((opt: any) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </div>
                      )}

                      {/* File Upload */}
                      {(question.questionType === 'file_upload' || question.questionType === 'file') && (
                        <div className="space-y-4">
                          {!responses[question._id] ? (
                            <div className="relative">
                              <input
                                type="file"
                                id={`file-${question._id}`}
                                className="hidden"
                                onChange={(e) => e.target.files && handleFileUpload(question._id, e.target.files[0])}
                                disabled={uploadingFiles[question._id]}
                              />
                              <Label
                                htmlFor={`file-${question._id}`}
                                className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer ${uploadingFiles[question._id] ? 'bg-muted/50 border-muted-foreground/30 opacity-50' : 'bg-muted/10 border-border hover:bg-primary/5 hover:border-primary/50'}`}
                              >
                                {uploadingFiles[question._id] ? (
                                  <>
                                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                                    <span className="text-sm font-medium animate-pulse">Uploading file...</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-3">
                                      <Upload className="w-5 h-5 text-primary opacity-70" />
                                    </div>
                                    <span className="text-sm font-semibold text-foreground/80">Click to upload document</span>
                                    <span className="text-xs text-muted-foreground mt-1">Images, PDF or Documents</span>
                                  </>
                                )}
                              </Label>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl">
                              <div className="flex items-center gap-3">
                                <FileCheck className="w-5 h-5 text-green-600" />
                                <div className="max-w-[150px] md:max-w-xs overflow-hidden">
                                  <p className="text-xs font-bold text-foreground truncate">File Attached Successfully</p>
                                  <a href={responses[question._id]} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline block truncate opacity-80">
                                    Click here to preview
                                  </a>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleInputChange(question._id, '')}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 rounded-full"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <footer className="pt-6 pb-12">
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-14 md:h-16 rounded-xl text-lg shadow-sm transition-all border-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-3" />
                  Submit Response
                </>
              )}
            </Button>
            
            
          </footer>
        </form>
      </div>
    </div>
  );
};

export default PublicForm;
