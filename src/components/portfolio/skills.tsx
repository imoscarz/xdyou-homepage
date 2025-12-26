import React from "react";

import type { IconProps } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

interface Skill {
  name: string;
  icon?: (props: IconProps) => React.ReactElement;
}

export default function Skills({ skills }: { skills: readonly (string | Skill)[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {skills.map((skill) => {
        const skillName = typeof skill === "string" ? skill : skill.name;
        const SkillIcon = typeof skill === "object" && skill.icon ? skill.icon : null;
        
        return (
          <Badge key={skillName} className="flex items-center gap-1.5">
            {SkillIcon && <SkillIcon className="size-3" />}
            {skillName}
          </Badge>
        );
      })}
    </div>
  );
}
