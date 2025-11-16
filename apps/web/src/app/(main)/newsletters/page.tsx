"use client";

import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import PageTransition from "./pagetransition";
import { useShowSidebar } from "@/store/useShowSidebar";
import { useSubscription } from "@/hooks/useSubscription";
import Image from "next/image";
import { posts } from "@/data/newsletters";
import { IconWrapper } from "@/components/ui/IconWrapper";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import News from "@/components/non-pro-news/News";

export default function NewslettersPage() {
  const { isCollapsed, showSidebar, setShowSidebar } = useShowSidebar();
  const { isPaidUser, isLoading } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Sidebar auto-hide hamburger when open
  useEffect(() => {
    if (showSidebar) {
      // nothing needed, this triggers rerender & hides hamburger
    }
  }, [showSidebar]);

  // Get months/years from posts
  const { months, years } = useMemo(() => {
    const monthsSet = new Set<string>();
    const yearsSet = new Set<string>();

    posts.forEach((post) => {
      const date = new Date(post.date);
      monthsSet.add(date.toLocaleString("default", { month: "long" }));
      yearsSet.add(date.getFullYear().toString());
    });

    return {
      months: Array.from(monthsSet).sort((a, b) => {
        const order = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return order.indexOf(a) - order.indexOf(b);
      }),
      years: Array.from(yearsSet).sort((a, b) => Number(b) - Number(a)),
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = post.heading.toLowerCase().includes(query);

      const date = new Date(post.date);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear().toString();

      const matchesMonth = !selectedMonth || month === selectedMonth;
      const matchesYear = !selectedYear || year === selectedYear;

      return matchesSearch && matchesMonth && matchesYear;
    });

    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [searchQuery, selectedMonth, selectedYear, posts]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMonth("");
    setSelectedYear("");
  };

  const hasActiveFilters = searchQuery || selectedMonth || selectedYear;

  // Loading
  if (isLoading) {
    return (
      <div className="flex w-screen h-screen bg-[#0a0a0b] overflow-hidden">
        <aside className={`h-full ${!showSidebar && "hidden xl:block"}`}>
          <Sidebar />
        </aside>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  // Non-Pro UI
  if (!isPaidUser) {
    return (
      <div className="flex w-screen h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`h-full z-50 ${!showSidebar && "hidden xl:block"}`}>
          <Sidebar />
        </aside>

        {/* Overlay for mobile */}
        {showSidebar && (
          <div
            onClick={() => setShowSidebar(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm xl:hidden z-40"
          />
        )}

        {/* Hamburger Button */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="xl:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-lg bg-[#1a1a1d] border border-white/10 flex items-center justify-center hover:bg-[#2a2a2d] transition-colors"
          >
            <Bars3Icon className="size-5 text-ox-purple" />
          </button>
        )}

        <News />
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen bg-[#0a0a0b] overflow-hidden">
      {/* Sidebar */}
      <aside className={`h-full z-50 ${!showSidebar && "hidden xl:block"}`}>
        <Sidebar />
      </aside>

      {/* Overlay (mobile only) */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm xl:hidden z-40"
        />
      )}

      {/* Hamburger (auto-hidden when sidebar open) */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="xl:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-lg bg-[#1a1a1d] border border-white/10 flex items-center justify-center hover:bg-[#2a2a2d] transition-colors"
        >
          <Bars3Icon className="size-5 text-ox-purple" />
        </button>
      )}

      <div className="flex-1 flex flex-col h-full">
        {/* Mobile header */}
        <div className="xl:hidden flex items-center h-16 px-4 border-b border-[#1a1a1d]">
          <IconWrapper onClick={() => setShowSidebar(true)}>
            <Bars3Icon className="size-5 text-ox-purple" />
          </IconWrapper>
        </div>

        {/* Content */}
        <main className="flex-1 h-full overflow-auto">
          <PageTransition>
            <div
              className="bg-[#0f0f0f] w-full min-h-screen px-[60px] pt-10 pb-[100px] flex max-[1024px]:flex-col max-[1024px]:px-5 max-[768px]:px-[15px] max-[768px]:pt-[30px] max-[480px]:px-[10px] max-[480px]:pt-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            >
              {/* LEFT Section */}
              <div className="w-[28%] max-[1279px]:w-[32%] max-[1024px]:w-full max-[1024px]:mb-10 max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:items-center max-[768px]:mb-[60px]">
                <div className="flex flex-col max-[1024px]:flex-row max-[1024px]:items-center max-[1024px]:justify-center max-[1024px]:gap-0">
                  <h1 className="max-[1024px]:m-0 max-[1024px]:p-0 max-[1024px]:leading-none">
                    <span className="text-[80px] font-medium relative top-[100px] max-[1279px]:text-[68px] max-[1279px]:top-[80px] max-[1024px]:static max-[1024px]:text-[46px] max-[768px]:text-4xl max-[480px]:text-[28px]">
                      NE
                    </span>
                  </h1>

                  <h1 className="max-[1024px]:m-0 max-[1024px]:p-0 max-[1024px]:leading-none">
                    <span className="text-[80px] font-medium relative left-[30px] top-[60px] max-[1279px]:text-[68px] max-[1279px]:left-[25px] max-[1279px]:top-[50px] max-[1024px]:static max-[1024px]:text-[46px] max-[768px]:text-4xl max-[480px]:text-[28px]">
                      WS—
                    </span>
                  </h1>

                  <h1 className="max-[1024px]:m-0 max-[1024px]:p-0 max-[1024px]:leading-none">
                    <span className="text-[80px] font-medium relative top-5 max-[1279px]:text-[68px] max-[1024px]:static max-[1024px]:text-[46px] max-[768px]:text-4xl max-[480px]:text-[28px]">
                      LET
                    </span>
                  </h1>

                  <h1 className="max-[1024px]:m-0 max-[1024px]:p-0 max-[1024px]:leading-none">
                    <span className="text-[80px] font-medium relative top-[-20px] left-[30px] max-[1279px]:text-[68px] max-[1279px]:top-[-10px] max-[1279px]:left-[25px] max-[1024px]:static max-[1024px]:text-[46px] max-[768px]:text-4xl max-[480px]:text-[28px]">
                      TER
                    </span>
                  </h1>

                  <h1 className="max-[1024px]:m-0 max-[1024px]:p-0 max-[1024px]:leading-none">
                    <span className="text-[80px] font-medium relative top-[-60px] max-[1279px]:text-[68px] max-[1279px]:top-[-50px] max-[1024px]:static max-[1024px]:text-[46px] max-[768px]:text-4xl max-[480px]:text-[28px]">
                      S
                    </span>
                  </h1>
                </div>

                <div>
                  <p className="text-[25px] font-extralight relative top-[-155px] left-[65px] max-[1279px]:top-[-135px] max-[1279px]:left-[55px] max-[1024px]:static max-[1024px]:text-center max-[1024px]:text-lg">
                    Latest News
                  </p>
                  <p className="text-[25px] font-extralight relative top-[-165px] left-[90px] max-[1279px]:top-[-145px] max-[1279px]:left-[75px] max-[1024px]:static max-[1024px]:text-center max-[1024px]:text-lg">
                    &nbsp;and updates
                  </p>
                </div>
              </div>

              {/* RIGHT Section */}
              <div className="w-[55%] h-fit relative top-[120px] max-[1279px]:w-[60%] max-[1024px]:w-full max-[1024px]:static">
                {/* Search and Filters */}
                <div className="flex gap-[15px] mb-8 relative top-[-110px] max-[1024px]:static max-[768px]:flex-col">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search newsletters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-[14px] pr-[45px] pl-5 text-base border border-white/20 rounded-xl bg-white/10 backdrop-blur-[10px] text-white placeholder:text-white/60"
                    />

                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-[15px] top-1/2 -translate-y-1/2 bg-white/20 w-7 h-7 rounded-full text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Month Filter */}
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="py-[14px] px-5 text-base border border-white/20 rounded-xl bg-white/10 backdrop-blur-[10px] text-white cursor-pointer max-[768px]:w-full"
                  >
                    <option value="" className="bg-[#0f0f0f]">
                      All Months
                    </option>
                    {months.map((month) => (
                      <option key={month} value={month} className="bg-[#0f0f0f]">
                        {month}
                      </option>
                    ))}
                  </select>

                  {/* Year Filter */}
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="py-[14px] px-5 text-base border border-white/20 rounded-xl bg-white/10 backdrop-blur-[10px] text-white cursor-pointer max-[768px]:w-full"
                  >
                    <option value="" className="bg-[#0f0f0f]">
                      All Years
                    </option>
                    {years.map((year) => (
                      <option key={year} value={year} className="bg-[#0f0f0f]">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Count and Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex items-center justify-between relative top-[-100px] mb-4 max-[1024px]:static max-[1024px]:mb-6">
                    <p className="text-white/80 text-sm font-medium">
                      Found {filteredPosts.length} result
                      {filteredPosts.length !== 1 ? "s" : ""}
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-white/60 hover:text-white transition-colors underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}

                {/* Posts */}
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <div
                      key={index}
                      className="flex mb-[50px] relative top-[-80px] max-[1279px]:top-[-60px] max-[1024px]:static max-[1024px]:flex-col max-[1024px]:mb-10 max-[768px]:flex-col max-[768px]:items-start max-[768px]:mt-[30px]"
                    >
                      <div className="relative shrink-0 w-[220px] h-[380px] border border-white max-[1279px]:w-[200px] max-[1279px]:h-[340px] max-[1279px]:border-none max-[1024px]:w-full max-[1024px]:h-[200px] max-[1024px]:mb-[15px]">
                        <Image
                          src={post.image}
                          alt={post.heading}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="ml-[30px] max-[1024px]:ml-0">
                        <h3 className="font-extralight text-[13px]">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).toUpperCase()}
                        </h3>

                        <h2 className="text-[27px] font-normal leading-[1.1] relative top-[10px] max-[1279px]:text-2xl max-[1024px]:static max-[1024px]:mb-[10px]">
                          {post.heading}
                        </h2>

                        <Link
                          href={`/newsletters/${post.slug}`}
                          className="inline-block bg-[#9455f4] text-[15px] py-[5px] px-[10px] rounded-[20px] relative top-[30px] font-medium w-[130px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#7c3dd8] max-[1024px]:static max-[1024px]:mt-[10px] text-center"
                        >
                          Read more...
                        </Link>

                        <p className="text-sm text-[#cdcdcd] relative top-[90px] max-[1024px]:static max-[1024px]:mt-[15px] max-[480px]:text-[13px]">
                          {post.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-[60px] px-5 bg-white/5 rounded-2xl border border-white/10 relative top-[-90px] max-[1024px]:top-0">
                    <p className="text-white/80 text-lg mb-5">
                      No newsletters found
                    </p>
                    <button
                      onClick={clearFilters}
                      className="py-[10px] px-6 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}