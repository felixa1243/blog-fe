import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
async function getPosts() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_API_URL}/posts`);
  if (!res.ok) return [];
  return res.json();
}

export default async function LoginPage() {
  const posts = await getPosts();
  console.log(posts)
  return (

    <div className="flex flex-col items-center justify-center min-h-screen py-16">
      <div className="flex flex-col gap-7">
        {
          posts?.posts?.length > 0 ? posts?.posts?.map((post) => (
            <Card key={post.id} className="relative mx-auto w-full max-w-sm pt-0">
              <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
              <img
                src={process.env.NEXT_PUBLIC_BLOG_API_URL + "/" + post.thumbnail_path}
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
              />
              <CardHeader>
                <CardAction>
                  <Badge variant="secondary">Featured</Badge>
                </CardAction>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  A practical talk on component APIs, accessibility, and shipping
                  faster.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={`/posts/${post.slug}`}>Read more</Link>
              </CardFooter>
            </Card>
          ))
            : (
              <div className="text-black">
                <h1>No posts found</h1>
              </div>
            )
        }
      </div>

    </div>
  );
}
