

async function getPosts() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_API_URL}/posts`);
  if (!res.ok) return [];
  return res.json();
}

export default async function LoginPage() {
  const posts = await getPosts();
  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col gap-7">
        {
          posts?.posts?.length > 0 && posts?.posts?.map((post) => (
            <div className="text-white" key={post.id}>
              <h1>{post.title}</h1>
              <p>{post.description}</p>
            </div>
          ))
        }
      </div>

    </div>
  );
}
