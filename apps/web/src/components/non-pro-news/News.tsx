import { Terminal } from "lucide-react";
import PrimaryButton from "../ui/custom-button";
import Link from "next/link";

export default function News() {
  return (
    <div className="relative flex flex-col justify-center items-center w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-[#0a0014]">
      <div className="absolute top-0 right-1/4 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-purple-600/30 rounded-full blur-[100px] md:blur-[120px] opacity-60" />
      <div className="absolute bottom-0 left-1/3 w-[350px] sm:w-[450px] md:w-[500px] h-[350px] sm:h-[450px] md:h-[500px] bg-indigo-600/20 rounded-full blur-[80px] md:blur-[100px] opacity-50" />
      <div className="absolute top-1/2 right-1/3 w-[300px] sm:w-[350px] md:w-[400px] h-[300px] sm:h-[350px] md:h-[400px] bg-violet-600/20 rounded-full blur-[60px] md:blur-[80px] opacity-40" />

      <div className="relative z-10 flex flex-col items-center max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-tight">
            Stay Ahead in Open
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Source—with Opensox
          </h1>
        </div>

        {/* Subheading */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 max-w-3xl">
          <p className="text-lg sm:text-xl md:text-xl text-zinc-200 font-light mb-1 sm:mb-2">
            Curated insights, repo recommendations, industry news and developer tools.
          </p>
          <p className="text-lg sm:text-xl md:text-xl text-zinc-200 font-light">
            No spam. Just high-quality updates that save you hours.
          </p>
        </div>

        {/* CTA Button */}
        <Link href="/pricing">
          <PrimaryButton>
            <Terminal className="w-5 h-5" />
            Subscribe Now
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );
}