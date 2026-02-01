import { BaseHubImage } from "basehub/next-image";

import { Heading } from "@/common/heading";
import { Section } from "@/common/layout";
import { fragmentOn } from "basehub";
import { buttonFragment, headingFragment } from "@/lib/basehub/fragments";
import { TrackedButtonLink } from "@/app/_components/tracked_button";
import { GeneralEvents } from "@/../basehub-types";

export const featuresGridFragment = fragmentOn("FeaturesGridComponent", {
  _analyticsKey: true,
  featuresGridList: {
    items: {
      _id: true,
      _title: true,
      description: true,
      icon: {
        alt: true,
        url: true,
      },
    },
  },
  heading: headingFragment,
  actions: buttonFragment,
});

type FeaturesGrid = fragmentOn.infer<typeof featuresGridFragment>;

export function FeaturesGrid({
  heading,
  featuresGridList,
  actions,
  eventsKey,
}: FeaturesGrid & { eventsKey: GeneralEvents["ingestKey"] }) {
  return (
    <Section>
      <Heading {...heading}>
        <h4>{heading.title}</h4>
      </Heading>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        {featuresGridList.items.map(({ _id, _title, description, icon }) => (
          <article
            key={_id}
            className="border-border dark:border-dark-border flex flex-col gap-4 rounded-lg border p-4 [box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset] dark:[box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset]"
          >
            <figure className="border-border bg-surface-secondary dark:border-dark-border dark:bg-dark-surface-secondary flex size-9 items-center justify-center rounded-full border p-2">
              <BaseHubImage
                alt={icon.alt ?? _title}
                className="dark:invert"
                height={18}
                src={icon.url}
                width={18}
              />
            </figure>
            <div className="flex flex-col items-start gap-2">
              <h5 className="text-lg font-medium">{_title}</h5>
              
              <div className="flex flex-col gap-2">
                {description.split('\n').filter((line) => line.trim() !== "").map((line, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {/* L'icône Check (coche) */}
                    <svg 
                      className="mt-1 size-4 shrink-0 text-text-secondary dark:text-dark-text-secondary opacity-70" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    
                    {/* Le texte */}
                    <p className="text-text-secondary dark:text-dark-text-secondary text-pretty">
                      {line}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 md:order-3">
        {actions?.map((action) => (
          <TrackedButtonLink
            key={action._id}
            analyticsKey={eventsKey}
            href={action.href}
            intent={action.type}
            name="cta_click"
            size="lg"
          >
            {action.label}
          </TrackedButtonLink>
        ))}
      </div>
    </Section>
  );
}
