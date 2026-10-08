import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import StoryForm from "@/components/story-form"

export default function ShareStoryPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#d9d9d9]">

      {/* ===================== NAV ===================== */}
      <SiteNav />


      {/* ===================== SHARE YOUR STORY ===================== */}
      {/* 155px below the nav, 107px above the footer */}
      <section className="w-full px-4 pt-12 pb-16 lg:pt-[155px] lg:pb-[107px]">

        {/* Card — 951 x 1195, 48px corners, content centred, 31px between blocks */}
        <div className="mx-auto flex w-full max-w-[951px] flex-col items-center justify-center gap-[31px] rounded-[32px] bg-[#ebe9e9] px-5 py-12 sm:px-10 lg:min-h-[1195px] lg:rounded-[48px] lg:px-0">

          <div className="flex w-full flex-col items-center">

            {/* Heading + intro — 631 wide, 31px apart */}
            <div className="flex w-full max-w-[631px] flex-col items-center gap-[31px] text-center text-black">
              <h1 className="cap-trim font-serif text-[44px] sm:text-[56px] lg:text-[66px]">Share Your Story</h1>
              <p className="cap-trim text-base leading-[26px] tracking-[0.05em] lg:text-[18px] lg:leading-[27px]">
                Tell us what God has done, or send in something you&apos;d like the fellowship to pray with you
                about. Every submission is reviewed before anything is shared publicly.
              </p>
            </div>

            {/* Toggle + fields (client component) */}
            <StoryForm />
          </div>

          {/* Footnote — 744 wide */}
          <p className="cap-trim max-w-[744px] text-center text-base leading-[26px] tracking-[0.05em] text-[#242323]/[0.63] lg:text-[18px] lg:leading-[27px]">
            Your submission goes to our team for review first. Approved stories appear on the About page — nothing
            is posted automatically.
          </p>

        </div>
      </section>


      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </main>
  )
}