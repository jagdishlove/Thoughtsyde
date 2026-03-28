"use client";
import React, { useState, useMemo } from 'react';
import { Download, Search, Star, Filter, ChevronLeft, ChevronRight, MessageSquare, Mail, User } from 'lucide-react';
import Ratings from './ratings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InferSelectModel } from "drizzle-orm";
import { feedbacks } from "@/db/schema";

type Feedback = InferSelectModel<typeof feedbacks>;

type FilterState = {
  search: string;
  rating: number | null;
  sortBy: 'newest' | 'rating-high' | 'rating-low';
};

function FeedbackAnalytics({ data }: { data: Feedback[] }) {
  const stats = useMemo(() => {
    const total = data.length;
    const avgRating = total > 0 
      ? (data.reduce((acc, f) => acc + (f.rating || 0), 0) / total).toFixed(1)
      : '0';
    
    const distribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: data.filter(f => f.rating === rating).length,
      percentage: total > 0 ? Math.round((data.filter(f => f.rating === rating).length / total) * 100) : 0
    }));

    return { total, avgRating, distribution };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Feedback */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.total === 0 ? 'No feedback yet' : 'All time feedback'}
          </p>
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.avgRating}</span>
            <span className="text-yellow-500">★</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            out of 5 stars
          </p>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {stats.distribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2 text-xs">
              <span className="w-3">{rating}★</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Table({ data }: { data: Feedback[] }) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    rating: null,
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(f => 
        f.userName?.toLowerCase().includes(searchLower) ||
        f.userEmail?.toLowerCase().includes(searchLower) ||
        f.message?.toLowerCase().includes(searchLower)
      );
    }

    // Apply rating filter
    if (filters.rating !== null) {
      result = result.filter(f => f.rating === filters.rating);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating-high':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-low':
          return (a.rating || 0) - (b.rating || 0);
        case 'newest':
        default:
          return (b.id || 0) - (a.id || 0); // Assuming higher ID = newer
      }
    });

    return result;
  }, [data, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Rating', 'Message'];
    const quote = String.fromCharCode(34);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(f => [
        quote + (f.userName || '') + quote,
        quote + (f.userEmail || '') + quote,
        f.rating || 'N/A',
        quote + (f.message || '').replace(/"/g, quote + quote) + quote
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No feedback yet</h3>
        <p className="text-gray-500">Install the widget to start collecting feedback</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Analytics */}
      <FeedbackAnalytics data={data} />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, or message..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select
              value={filters.rating?.toString() || 'all'}
              onValueChange={(value) => {
                setFilters(prev => ({ 
                  ...prev, 
                  rating: value === 'all' ? null : parseInt(value)
                }));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars Only</SelectItem>
                <SelectItem value="4">4 Stars Only</SelectItem>
                <SelectItem value="3">3 Stars Only</SelectItem>
                <SelectItem value="2">2 Stars Only</SelectItem>
                <SelectItem value="1">1 Star Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <Select
            value={filters.sortBy}
            onValueChange={(value: any) => 
              setFilters(prev => ({ ...prev, sortBy: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rating-high">Highest Rated</SelectItem>
              <SelectItem value="rating-low">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* Export */}
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Active Filters */}
        {(filters.search || filters.rating !== null) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{filters.search}"
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.rating !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.rating} Stars
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, rating: null }))}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            <button
              onClick={() => {
                setFilters({ search: '', rating: null, sortBy: 'newest' });
                setCurrentPage(1);
              }}
              className="text-sm text-indigo-600 hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {paginatedData.length} of {filteredData.length} feedback
          {filteredData.length !== data.length && ` (filtered from ${data.length} total)`}
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-700 w-32">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Rating
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedData.map((feedback) => (
              <tr key={feedback.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {feedback.userName || 'Anonymous'}
                  </div>
                </td>
                <td className="p-4">
                  <a 
                    href={`mailto:${feedback.userEmail}`}
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    {feedback.userEmail || 'No email'}
                  </a>
                </td>
                <td className="p-4">
                  {feedback.rating ? (
                    <div className="flex items-center gap-1">
                      <Ratings rating={feedback.rating} count={5} />
                      <span className="text-sm text-gray-600 ml-1">
                        {feedback.rating}/5
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No rating</span>
                  )}
                </td>
                <td className="p-4">
                  <p className="text-sm text-gray-700 max-w-md truncate">
                    {feedback.message || 'No message'}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;