"use client";

import { experience } from "@/data/experience";
import SectionHeading from "@/components/ui/SectionHeading";
import TimelineItem from "@/components/ui/TimelineItem";

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-card/30">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading
          label="Experience"
          title="Where I've Been"
          subtitle="My education and professional journey"
        />

        <div>
          {experience.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
