
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
}

const SearchForm = ({ searchQuery, setSearchQuery, handleSearch, isSearching }: SearchFormProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          type="text"
          placeholder="Search for songs, artists or albums..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <Button 
        onClick={handleSearch} 
        disabled={isSearching || !searchQuery.trim()}
        className="w-full md:w-auto"
      >
        {isSearching ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default SearchForm;
