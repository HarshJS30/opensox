import PageTransition from "../pagetransition";
import Image from "next/image";
import { ArrowLeft } from 'lucide-react';
import { getNewsletterContent } from "@/lib/newslettercontent";
import { posts } from "@/data/newsletters";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NewsletterSlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = posts.find((p) => p.slug === slug);
  
  // if post doesn't exist, show 404 page
  if (!post) {
    notFound();
  }

  const { htmlContent } = await getNewsletterContent(slug);

  return (
    <PageTransition>
      <div className="
        bg-transparent 
        [background-image:radial-gradient(#3b3b3b_1px,transparent_1px)]
        [background-size:22px_22px]
        py-10 px-6 md:px-10 lg:px-16
      ">
        
        {/* BACK BUTTON */}
        <div className="
          fixed 
          flex items-center 
          bg-[#9455f4] 
          rounded-2xl 
          text-[15px] 
          px-3 py-1.5
        ">
          <ArrowLeft />
          <Link href="/newsletters" className="ml-2">
            Back to Newsletters
          </Link>
        </div>

        {/* HEADER IMAGE */}
        <Image
          src={post.coverimg}
          width={650}
          alt="img"
          className="
            mx-auto 
            mt-10 mb-16 
            max-w-full 
            lg:w-[650px]
          "
        />

        {/* ROW */}
        <div className="flex flex-row gap-4 mb-8">
          <p className="
            bg-[#9455f4] 
            w-20 h-7 
            text-[14px] 
            border border-white 
            rounded-2xl 
            flex items-center justify-center
          ">
            Article
          </p>

          <p className="text-[12px] relative top-[2px]">
            {post.date}
          </p>
        </div>

        {/* CONTENT */}
        <div className="w-full lg:w-[70%]">
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </div>

      </div>
    </PageTransition>
  );
}