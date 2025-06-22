type SkillCode = number;

class Skill {
  public readonly code: SkillCode;
  public readonly name: string;
  public readonly description: string;

  public constructor(code: SkillCode, name: string, description: string) {
    this.code = code;
    this.name = name;
    this.description = description;
  }
}

export type { SkillCode };
export default Skill;