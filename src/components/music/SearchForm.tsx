
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
}

const SearchForm = ({ searchQuery, setSearchQuery, handleSearch, isSearching }: SearchFormProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className={cn(
        "relative w-full transition-all duration-300",
        isFocused ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-md" : ""
      )}>
        <Search 
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300",
            isFocused ? "text-primary" : "text-muted-foreground"
          )} 
          size={18} 
        />
        <Input
          type="text"
          placeholder="Search for songs, artists or albums..."
          className={cn(
            "pl-10 w-full transition-all duration-300",
            isFocused ? "border-primary" : ""
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      <Button 
        onClick={handleSearch} 
        disabled={isSearching || !searchQuery.trim()}
        className={cn(
          "w-full md:w-auto transition-all duration-300 hover:shadow-lg",
          isSearching ? "animate-pulse" : ""
        )}
      >
        {isSearching ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default SearchForm;
