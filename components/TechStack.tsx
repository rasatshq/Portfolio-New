import type { SkillGroup } from "@/types/portfolio";

export function TechStack({ initialGroups: groups }: { initialGroups: SkillGroup[] }) {
  return (
    <section id="skills" className="section-spacing" aria-labelledby="skills-title">
      <div className="section-heading"><div><p className="eyebrow">04 / Technical index</p><h2 id="skills-title" className="section-title">What I work with.</h2></div><p>A working directory of my tools<br />and where I use them.</p></div>
      <div className="skill-groups">
        {groups.length === 0 && <p className="empty-state">No skills listed yet.</p>}
        {groups.map((group, index) => <div className="skill-group" key={group.id}>
          <div className="skill-heading"><span className="index-number">{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3><span className="skill-count">{group.skills.length}</span></div>
          {group.skills.length === 0 ? <p className="empty-state">No skills listed in this category yet.</p> : <dl className="skill-directory">{group.skills.map(skill => <div key={skill.id} className="skill-row"><dt>{skill.name}</dt><dd>{skill.desc}</dd></div>)}</dl>}
        </div>)}
      </div>
    </section>
  );
}
