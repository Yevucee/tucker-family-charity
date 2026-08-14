/**
 * Static prerender bodies built from the same copy sources as visible React pages.
 * Keep this file aligned with page heroes and shared data modules.
 */
import { hatPageCopy, HAT_ORDER_EMAIL } from "../data/copy/hatPageCopy.ts";
import { winePageCopy, WINE_ORDER_EMAIL } from "../data/copy/winePageCopy.ts";
import { kitfLibraryPageCopy } from "../data/copy/kitfLibraryPageCopy.ts";

function shell(main: string): string {
  return `<div id="static-prerender" data-prerender="true">${main}</div>`;
}

export function buildStaticHtmlForPath(path: string): string {
  switch (path) {
    case "/":
      return shell(
        `<main id="main-content"><h1>Connecting People. Creating Opportunity. Uplifting Communities.</h1><p>A vibrant family-led charity creating practical opportunities and supporting vulnerable communities through partnership, action and shared purpose — from Oliver's Village to the broader community.</p><p><a href="/about/">Our Story</a> · <a href="/olivers-village/">Oliver's Village</a></p></main>`,
      );

    case "/about":
      return shell(
        `<main id="main-content"><h1>The Story of the Tucker Family Charity</h1><p>In 2009, everything changed for us.</p><p>As we waited for the arrival of our first daughter, Madison, due on 13 August 2009, we found ourselves in a moment of deep reflection. Like many soon-to-be parents, we were filled with excitement, but also a growing sense of responsibility. Not just for the life we were bringing into the world, but for the world she would grow up in.</p><h2>Our Mission & Values</h2><h3>Compassion</h3><p>We lead with empathy and a genuine commitment to improving lives</p><h3>Impact</h3><p>Every action we take is focused on creating measurable, lasting change</p><h3>Community</h3><p>We believe in the power of people coming together for a common purpose</p><h3>Integrity</h3><p>We operate with transparency and accountability in everything we do</p></main>`,
      );

    case "/olivers-village":
      return shell(
        `<main id="main-content"><h1>Oliver's Village</h1><p>A community education centre in Putfontein Benoni that Tucker Family Charity is proud to support - Oliver's Village provides various social services such as education, skills development, early childhood care and food security.</p><p><a href="https://oliversvillage.co.za/">Visit oliversvillage.co.za</a> · <a href="https://oliversvillage.co.za/donations-form/">Donate to Oliver's Village</a></p></main>`,
      );

    case "/events":
      return shell(
        `<main id="main-content"><h1>Events & Activities</h1><p>Join us and be part of our community making a difference</p><p>Throughout the year, we host a variety of events that bring our community together while raising vital funds for Oliver's Village and other initiatives we support.</p></main>`,
      );

    case "/shop":
      return shell(
        `<main id="main-content"><h1>Shop & offers</h1><p>Show your support by browsing our featured products and partner offers. Every purchase helps support our initiatives.</p><p><a href="/shop/personalised-hat/">Personalised Tucker Family Charity caps</a> · <a href="/shop/wine/">Tucker Family Charity Wine</a></p></main>`,
      );

    case "/shop/personalised-hat":
      return shell(
        `<main id="main-content"><h1>${hatPageCopy.title}</h1><p>${hatPageCopy.intro}</p><p>${hatPageCopy.impactLine}</p><p>Orders via Cheyna Dot or email <a href="mailto:${HAT_ORDER_EMAIL}">${HAT_ORDER_EMAIL}</a></p></main>`,
      );

    case "/shop/wine":
      return shell(
        `<main id="main-content"><h1>${winePageCopy.title}</h1><p>${winePageCopy.intro}</p><p>${winePageCopy.impactLine}</p><p>Wine orders: <a href="mailto:${WINE_ORDER_EMAIL}">${WINE_ORDER_EMAIL}</a></p></main>`,
      );

    case "/partners":
      return shell(
        `<main id="main-content"><h1>Our Partners</h1><p>Supported by organisations who share our commitment to community</p><p>Interested in partnering? Email <a href="mailto:info@tuckerfamilycharity.org?subject=Partnership%20Enquiry">info@tuckerfamilycharity.org</a></p></main>`,
      );

    case "/donate":
      return shell(
        `<main id="main-content"><h1>Support Us</h1><p>There are many ways to support Tucker Family Charity. Whether you give financially, offer your time, donate useful items or purchase our charity merchandise, every contribution helps us create practical impact through community, partnerships and shared effort.</p><h2>Donate money</h2><h2>Give your time</h2><h2>Donate items</h2><p><a href="/shop/">Shop charity products</a></p></main>`,
      );

    case "/keep-it-in-the-family":
      return shell(
        `<main id="main-content"><h1>Keep It In The Family</h1><p>Support family and friends in business—trusted professionals in one place. Add your service so the community can find you.</p><p><a href="/keep-it-in-the-family/library/">Browse the resource library</a></p></main>`,
      );

    case "/keep-it-in-the-family/library":
      return shell(
        `<main id="main-content"><p>${kitfLibraryPageCopy.subtitle}</p><h1>${kitfLibraryPageCopy.title}</h1><p>${kitfLibraryPageCopy.intro}</p><p><a href="/keep-it-in-the-family/">Back to Keep It In The Family</a></p></main>`,
      );

    case "/golf-learnership-programme":
      return shell(
        `<main id="main-content"><h1>Golf Learnership Programme</h1><p>A joint initiative by Tucker Family Foundation and Afrika Tikkun</p><p>The Golf Learnership Programme is a collaborative initiative designed to create practical pathways for young people through structured opportunity, support, exposure and development. Led by Tucker Family Foundation and Afrika Tikkun, the programme uses golf as a platform for building confidence, discipline, work readiness and future opportunity.</p></main>`,
      );

    case "/property-partnerships":
      return shell(
        `<main id="main-content"><h1>Property Partnerships</h1><p>Find a home while supporting Tucker Family Charity</p><p>Through selected property partnerships, supporters can enquire about homes for rent or sale while helping generate support for Tucker Family Charity. When a successful rental or sale comes through the charity referral route, a contribution may be made back to the charity.</p></main>`,
      );

    case "/work-opportunities/looking-for-work":
      return shell(
        `<main id="main-content"><p>Work Opportunities</p><h1>Looking for Work</h1><p>Candidate profiles from our network. Browse below, or email us if you would like to learn more about someone listed.</p></main>`,
      );

    case "/work-opportunities/work-available":
      return shell(
        `<main id="main-content"><p>Work Opportunities</p><h1>Work Available</h1><p>Roles and placements from our network. Browse below, or email us if you are interested in a listing.</p></main>`,
      );

    default:
      return shell(`<main id="main-content"><h1>Tucker Family Charity</h1></main>`);
  }
}
