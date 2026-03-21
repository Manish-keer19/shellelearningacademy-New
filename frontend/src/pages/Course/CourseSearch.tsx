import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Loader2 } from "lucide-react";
import { courseService } from '@/service/course.service';
import { useNavigate } from 'react-router-dom';

interface CourseSearchProps {
  onSearchResults?: (results: any[]) => void;
  placeholder?: string;
  showResults?: boolean;
}

const CourseSearch: React.FC<CourseSearchProps> = ({ 
  onSearchResults, 
  placeholder = "Search courses...",
  showResults = true 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      if (onSearchResults) onSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const res = await courseService.searchCourses(query);
      const results = res.data || [];
      setSearchResults(results);
      setShowDropdown(showResults && results.length > 0);
      if (onSearchResults) onSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    if (onSearchResults) onSearchResults([]);
  };

  const handleCourseSelect = (course: any) => {
    setShowDropdown(false);
    navigate(`/course-detail/${course._id}`);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-12 py-6 text-lg bg-card/80 backdrop-blur-lg border-border"
          onFocus={() => setShowDropdown(showResults && searchResults.length > 0)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-card/95 backdrop-blur-lg border-border shadow-lg max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.slice(0, 5).map((course: any) => (
                  <button
                    key={course._id}
                    onClick={() => handleCourseSelect(course)}
                    className="w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={course.thumbnail || '/placeholder.svg'}
                        alt={course.courseName}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-1">
                          {course.courseName}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {course.courseDescription}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {course.category?.name}
                          </Badge>
                          <span className="text-xs font-medium text-primary">
                            ${course.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {searchResults.length > 5 && (
                  <div className="p-3 text-center text-sm text-muted-foreground border-t border-border">
                    Showing 5 of {searchResults.length} results
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No courses found for "{searchQuery}"
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseSearch;