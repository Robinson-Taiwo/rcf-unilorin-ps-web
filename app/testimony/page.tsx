import React from 'react'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import StoryForm from '@/components/story-form'

const page = () => {
  return (
    <div className="w-full overflow-x-hidden">

      {/* ===================== NAV ===================== */}
      <SiteNav />

      {/* ===================== SHARE YOUR STORY ===================== */}
      <section className="share-story w-full bg-[#d9d9d9] px-4 md:px-10 py-12 md:py-32">

        <div className="story-card mx-auto w-full max-w-[800px] bg-[#ebeaea] rounded-[28px] md:rounded-[36px] px-5 sm:px-8 md:px-16 py-10 md:py-14">

          {/* Heading + intro */}
          <div className="flex flex-col items-center text-center gap-4 mb-8 md:mb-10">
            <h1 className="font-serif text-[#1c1c1c] text-4xl sm:text-5xl md:text-[56px] leading-tight">
              Share Your Story
            </h1>

            <p className="text-[#1c1c1c] text-sm md:text-base leading-relaxed max-w-[520px]">
              Tell us what God has done, or send in something you&apos;d like the
              fellowship to pray with you about. Every submission is reviewed
              before anything is shared publicly.
            </p>
          </div>

          {/* Interactive form (client component) */}
          <StoryForm />

        </div>

      </section>

      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </div>
  )
}

export default page
