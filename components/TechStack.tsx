import React from "react";
import type { SkillGroup } from "@/types/portfolio";
import { DEFAULT_SKILL_GROUPS } from "@/constants/skills";

interface TechStackProps {
  initialGroups?: SkillGroup[];
}

export function TechStack({ initialGroups }: TechStackProps) {
  const groups =
    initialGroups && initialGroups.length > 0
      ? initialGroups
      : DEFAULT_SKILL_GROUPS;

  return (
    <section id="skills" className="section-spacing">
      <div className="section-heading">
        <div>
          <p className="eyebrow">04 / MY TOOLKIT</p>
          <h2 className="section-title">
            The tools behind <em>the ideas.</em>
          </h2>
        </div>
      </div>
      <div className="skill-groups">
        {groups.map((group, index) => (
          <div className="skill-group" key={group.id || group.title}>
            <span className="eyebrow">0{index + 1}</span>
            <h3>{group.title}</h3>
            {group.skills.map((tech) => (
              <div key={tech.id || tech.name} className="skill-row">
                <strong>{tech.name}</strong>
                <span>{tech.desc}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
