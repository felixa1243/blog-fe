"use client"; // Required for useState and useEffect

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
type Post = { id: number, title: string, content: string, author_id: string, created_at: string, slug: string, thumbnail_path: string, updated_at: string }
export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const limit = 10;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BLOG_API_URL}/posts?page=${page}&limit=${limit}`
        );
        const result = await res.json();

        setPosts(result.data || []);
        setTotalPages(result.meta?.total_pages || 1);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);
  console.log(posts)
  return (
    <div className="flex bg-gray-950 flex-col items-center justify-center min-h-screen py-16 w-full relative z-0 px-4">
      <h2 className="text-4xl text-white">Blog Posts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 py-16 w-full max-w-7xl">
        {loading ? (
          <p className="text-white col-span-full text-center">Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post: Post) => (
            <Card key={post.id} className="relative mx-auto w-full pt-0 overflow-hidden">

              <img
                src={`${process.env.NEXT_PUBLIC_BLOG_API_URL}/${post.thumbnail_path}`}
                alt={post.title}
                className="relative z-20 aspect-video w-full object-cover"
              />
              <CardHeader>
                <CardAction>
                  <Badge variant="secondary">Featured</Badge>
                </CardAction>
                <CardTitle className="line-clamp-1">{post.title}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Link href={`/posts/${post.slug}`} className="text-blue-400 hover:underline">
                  Read more
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-white col-span-full text-center">
            <h1>No posts found</h1>
          </div>
        )}
      </div>
      {!loading && totalPages > 1 && (
        <div className="flex flex-wrap gap-2 items-center mt-8">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          {pageNumbers.map((num) => (
            <Button
              key={num}
              variant={page === num ? "default" : "outline"}
              className={page === num ? "bg-blue-600 text-white" : "text-white border-gray-700"}
              onClick={() => setPage(num)}
            >
              {num}
            </Button>
          ))}

          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}