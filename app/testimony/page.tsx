import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import StoryForm from "@/components/story-form"
import { container, type } from "@/components/rcf/Ui"

// Share Your Story — the design's centred card (on phones the content sits straight on the page, as in the mobile frame).
// On laptops/desktops (`fit:` = 1024+ wide and 600+ tall) the card section is exactly one screen tall under
// the 72px nav, so the whole form is visible without scrolling. The footer follows below, as on every page.
export default function ShareStoryPage() {
  return (
    <main className="w-full overflow-x-clip bg-[#ebe9e9] sm:bg-[#d9d9d9]">
      <SiteNav />

      <section className={`${container} pt-8 pb-10 sm:py-12 lg:py-14 fit:h-[calc(100svh-72px)] fit:py-[clamp(0.75rem,2svh,2.5rem)]`}>
        <StoryForm
          intro={
            <>
              <h1 className={`${type.title} text-black fit:text-[clamp(2rem,5svh,3rem)]`}>Share Your Story</h1>
              <p className={`${type.body} text-[#242323]/80 fit:text-[15px]`}>
                Tell us what God has done, or send in something you&apos;d like the fellowship to pray with you
                about. Every submission is reviewed before anything is shared publicly.
              </p>
            </>
          }
          footnote="Your submission goes to our team for review first. Approved stories appear on the About page — nothing is posted automatically."
        />
      </section>

      <SiteFooter />
    </main>
  )
}
