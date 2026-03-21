import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  FileText, 
  Settings, 
  Eye, 
  Trash2, 
  ClipboardList, 
  Share2,
  MoreVertical,
  Loader2,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { shellFormService } from "@/service/shellform.service";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const FormManagement = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchForms = async () => {
    setLoading(true);
    try {
      const response = await shellFormService.getForms();
      setForms(response.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleDeleteForm = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this form? All questions and responses will be lost.")) return;
    try {
      await shellFormService.deleteForm(id);
      toast.success("Form deleted successfully");
      fetchForms();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete form");
    }
  };

  const filteredForms = forms.filter(form => 
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-foreground mb-1">
              Shell<span className="text-primary">Forms</span>
            </h1>
            <p className="text-sm text-muted-foreground opacity-80">Manage your custom forms and surveys</p>
          </div>
          <Button 
            onClick={() => navigate("/admin/forms/create")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Form
          </Button>
        </motion.div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text"
            placeholder="Search forms by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Loading your forms...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-dashed border-2 border-border/50 py-20 text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No forms found</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchQuery ? "No forms match your search query." : "You haven't created any forms yet. Start by creating your first form!"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/admin/forms/create")} variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Create First Form
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form, index) => (
              <motion.div
                key={form._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${form.status === 'Published' ? 'from-green-500/20 to-emerald-500/20 text-green-600' : 'from-orange-500/20 to-amber-500/20 text-orange-600'}`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <Badge className={form.status === 'Published' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20'}>
                        {form.status}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{form.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{form.description || "No description provided."}</p>
                    
                    <div className="flex items-center text-xs text-muted-foreground mb-6">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded">/{form.slug}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => navigate(`/admin/forms/edit/${form._id}`)}
                      >
                        <Settings className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => navigate(`/admin/forms/responses/${form._id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        Result
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => {
                          const url = `${window.location.origin}/f/${form.slug}`;
                          navigator.clipboard.writeText(url);
                          toast.success("Link copied to clipboard");
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => window.open(`/f/${form.slug}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteForm(form._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FormManagement;
