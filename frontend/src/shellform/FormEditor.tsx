import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  GripVertical, 
  Settings2,
  List,
  Type,
  Hash,
  Mail,
  Phone,
  Calendar,
  Star,
  CheckSquare,
  ChevronDown,
  Loader2,
  Image as ImageIcon,
  FileUp
} from "lucide-react";
import { shellFormService } from "@/service/shellform.service";
import toast from "react-hot-toast";
import { motion, Reorder } from "framer-motion";

const QUESTION_TYPES = [
  { value: "short_text", label: "Short Text", icon: Type },
  { value: "long_text", label: "Paragraph", icon: List },
  { value: "number", label: "Number", icon: Hash },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "date", label: "Date", icon: Calendar },
  { value: "dropdown", label: "Dropdown", icon: ChevronDown },
  { value: "radio", label: "Single Choice", icon: Settings2 },
  { value: "checkbox", label: "Multiple Choice", icon: CheckSquare },
  { value: "rating", label: "Rating", icon: Star },
];

const FormEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formDetails, setFormDetails] = useState({
    title: "",
    description: "",
    status: "Draft",
    thankYouMessage: "Thank you for your response!",
  });

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (id && id !== 'create' && id !== 'undefined') {
      fetchFormData();
    }
  }, [id]);

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const response = await shellFormService.getFormById(id!);
      const { title, description, status, thankYouMessage, questions: fetchedQuestions } = response.data;
      setFormDetails({ title, description, status, thankYouMessage });
      setQuestions(fetchedQuestions.sort((a: any, b: any) => a.order - b.order));
    } catch (error: any) {
      toast.error("Failed to load form data");
      navigate("/admin/forms");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `new-${Date.now()}`,
      questionText: "Untitled Question",
      questionType: "short_text",
      required: false,
      options: [],
      order: questions.length
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (index: number, updates: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates };
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleAddOption = (qIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[qIndex];
    const options = [...(question.options || [])];
    options.push({ label: `Option ${options.length + 1}`, value: `option_${options.length + 1}` });
    question.options = options;
    setQuestions(updatedQuestions);
  };

  const handleUpdateOption = (qIndex: number, oIndex: number, label: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = { label, value: label.toLowerCase().replace(/\s+/g, '_') };
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_: any, i: number) => i !== oIndex);
    setQuestions(updatedQuestions);
  };

  const handleSave = async () => {
    if (!formDetails.title) {
      toast.error("Form title is required");
      return;
    }

    setSaving(true);
    try {
      let formId = id;
      if (id === 'create' || !id || id === 'undefined') {
        const res = await shellFormService.createForm(formDetails);
        formId = res.data._id;
      } else {
        await shellFormService.updateForm(id, formDetails);
      }

      // Save questions
      // For simplicity, we'll implement a logic where we might need to handle new vs existing questions
      // But for this task, I'll update all or create new ones.
      // A better way would be a bulk update API. 
      // Assuming our backend can handle questions update in form controller or we do it sequentially.
      
      // Let's assume we update the form with questions in one go if possible, 
      // or we handle questions one by one.
      // Based on my previous view of form controller, it doesn't seem to have bulk question update yet.
      // I'll stick to saving form details first.
      
      // Actually, I should check if the backend can handle questions in createForm/updateForm.
      // The model doesn't have questions field. Questions are separate models linking via formId.
      
      // I'll save questions sequentially for now, though not ideal.
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const qData = { ...q, formId, order: i };
        if (q.id && q.id.toString().startsWith('new-')) {
          delete qData.id;
          await shellFormService.createQuestion(qData);
        } else {
          await shellFormService.updateQuestion(q._id, qData);
        }
      }

      toast.success("Form saved successfully");
      navigate("/admin/forms");
    } catch (error: any) {
      toast.error(error.message || "Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-16 md:pb-20 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 md:mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin/forms")} className="flex items-center gap-2 w-fit -ml-2 sm:ml-0">
            <ArrowLeft className="w-4 h-4" /> Back to Forms
          </Button>
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
             <select 
              value={formDetails.status}
              onChange={(e) => setFormDetails({...formDetails, status: e.target.value})}
              className="px-3 md:px-4 py-2 rounded-lg bg-background border border-border outline-none text-sm font-medium w-full sm:w-auto flex-1 sm:flex-none cursor-pointer"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Closed">Closed</option>
            </select>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 w-full sm:w-auto flex-1 sm:flex-none">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Form Header Section */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card/90 backdrop-blur-sm border border-border/70 rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="h-2 md:h-3 bg-gradient-to-r from-primary to-green-500" />
              <div className="p-5 sm:p-6 md:p-10 space-y-4">
                <input 
                  type="text"
                  value={formDetails.title}
                  onChange={(e) => setFormDetails({...formDetails, title: e.target.value})}
                  placeholder="Form Title"
                  className="w-full text-3xl md:text-4xl font-extrabold bg-transparent border-b border-transparent focus:border-border outline-none focus:ring-0 placeholder:text-muted-foreground text-foreground tracking-tight transition-all pb-2"
                />
                <textarea 
                  value={formDetails.description}
                  onChange={(e) => setFormDetails({...formDetails, description: e.target.value})}
                  placeholder="Form description (optional)"
                  className="w-full text-base md:text-lg bg-transparent border-b border-transparent focus:border-border outline-none focus:ring-0 placeholder:text-muted-foreground resize-none min-h-[60px] text-foreground leading-relaxed transition-all pb-2 pt-2"
                />
              </div>
            </div>
          </motion.div>

          {/* Questions Section */}
          <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-6">
            {questions.map((question, index) => (
              <Reorder.Item key={question.id || question._id} value={question}>
                <div className="group relative bg-card/90 backdrop-blur-sm border border-border/70 hover:shadow-xl hover:-translate-y-1 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg transition-all duration-300">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2 bg-transparent group-hover:bg-gradient-to-b group-hover:from-primary group-hover:to-green-500 transition-all rounded-l-2xl md:rounded-l-3xl" />
                  
                  <div>
                    <div className="flex items-start gap-2 sm:gap-4 cursor-default">
                      <div className="mt-2 sm:mt-3 cursor-grab active:cursor-grabbing text-muted-foreground/30 p-1 hover:bg-muted rounded-md transition-colors hidden sm:block">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-grow space-y-4 w-full">
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
                          <div className="flex items-center gap-2 w-full">
                            <div className="sm:hidden cursor-grab active:cursor-grabbing text-muted-foreground/40">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <Input 
                              value={question.questionText}
                              onChange={(e) => handleUpdateQuestion(index, { questionText: e.target.value })}
                              placeholder="Question"
                              className="text-base font-semibold bg-secondary/10 border-border/20 focus-visible:ring-1 focus-visible:ring-primary/30 h-10 w-full"
                            />
                          </div>
                          <select 
                            value={question.questionType}
                            onChange={(e) => handleUpdateQuestion(index, { questionType: e.target.value, options: (e.target.value === 'radio' || e.target.value === 'checkbox' || e.target.value === 'dropdown') ? [{label: 'Option 1', value: 'option_1'}] : [] })}
                            className="w-full sm:w-48 px-4 py-2 rounded-lg bg-secondary/30 border-none outline-none text-sm font-medium focus:ring-1 focus:ring-primary/30 min-h-[40px] cursor-pointer"
                          >
                            {QUESTION_TYPES.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Options Section for multi-choice questions */}
                        {(question.questionType === 'radio' || question.questionType === 'checkbox' || question.questionType === 'dropdown') && (
                          <div className="pl-0 sm:pl-4 space-y-3">
                            {question.options?.map((option: any, oIndex: number) => (
                              <div key={oIndex} className="flex items-center gap-2 group/option relative">
                                {question.questionType === 'radio' ? <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex-shrink-0" /> : <div className="w-4 h-4 rounded border border-muted-foreground/30 flex-shrink-0" />}
                                <input 
                                  value={option.label}
                                  onChange={(e) => handleUpdateOption(index, oIndex, e.target.value)}
                                  className="w-full bg-transparent border-b border-transparent focus:border-border outline-none py-1 transition-all text-sm sm:text-base pr-8"
                                />
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 absolute right-0 sm:opacity-0 group-hover/option:opacity-100 text-muted-foreground hover:text-destructive focus:opacity-100 transition-opacity"
                                  onClick={() => handleRemoveOption(index, oIndex)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-primary hover:bg-primary/5 flex items-center gap-2"
                              onClick={() => handleAddOption(index)}
                            >
                              <Plus className="w-4 h-4" /> Add option
                            </Button>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border/30">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id={`req-${index}`} 
                                checked={question.required} 
                                onCheckedChange={(checked) => handleUpdateQuestion(index, { required: !!checked })}
                              />
                              <label htmlFor={`req-${index}`} className="text-xs font-medium text-muted-foreground cursor-pointer">Required</label>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveQuestion(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full"
          >
            <Button 
              onClick={handleAddQuestion}
              variant="outline"
              className="w-full py-8 sm:py-10 border-dashed border-2 border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all rounded-2xl md:rounded-3xl"
            >
              <div className="flex flex-col items-center gap-2">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="font-bold text-base sm:text-lg">Add Question</span>
              </div>
            </Button>
          </motion.div>

          <Card className="bg-card/90 backdrop-blur-sm border border-border/70 rounded-2xl md:rounded-3xl shadow-lg mt-6 md:mt-8">
            <CardContent className="p-5 sm:p-6 md:p-8 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-primary text-base sm:text-lg">
                <Settings2 className="w-5 h-5" /> Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Thank You Message</label>
                  <Input 
                    value={formDetails.thankYouMessage}
                    onChange={(e) => setFormDetails({...formDetails, thankYouMessage: e.target.value})}
                    placeholder="Message shown after submission"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FormEditor;
