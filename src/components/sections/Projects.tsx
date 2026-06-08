"use client";

import { projects } from "@/data/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import ProjectCard from "@/components/ui/ProjectCard";

export default function Projects() {
  const sorted = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Projects"
          title="What I've Built"
          subtitle="A selection of projects that showcase my skills and experience"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.filter((p) => p.featured).map((project, i) => (
            <AnimateOnScroll key={project.id} delay={i * 0.1}>
              <ProjectCard project={project} />
            </AnimateOnScroll>
          ))}
        </div>

        {sorted.filter((p) => !p.featured).length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
            {sorted.filter((p) => !p.featured).map((project, i) => (
              <AnimateOnScroll key={project.id} delay={i * 0.1}>
                <ProjectCard project={project} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
