import { AllowedCombatant } from "@/domain/ZoneSlot";

type ZoneOrganizationsType = 'BASE' | 'NO_LEADER' | 'ONLY_LEADER';
type ZoneOrganization = {
  index: number;
  columnCount: number;
  allowedCombatant: AllowedCombatant;
};

const DEFAULT_ZONE_ORGANIZATION: ZoneOrganization[] = [
  { index: 0, columnCount: 3, allowedCombatant: 'WARRIOR' },
  { index: 1, columnCount: 3, allowedCombatant: 'WARRIOR' },
  { index: 2, columnCount: 1, allowedCombatant: 'LEADER' }
];

const organizations = new Map<ZoneOrganizationsType, ZoneOrganization[]>();
organizations.set('BASE', DEFAULT_ZONE_ORGANIZATION);
organizations.set('NO_LEADER', [
  { index: 0, columnCount: 3, allowedCombatant: 'WARRIOR' },
  { index: 1, columnCount: 3, allowedCombatant: 'WARRIOR' },
  { index: 1, columnCount: 3, allowedCombatant: 'WARRIOR' },
]);

organizations.set('ONLY_LEADER', [
  { index: 2, columnCount: 1, allowedCombatant: 'LEADER' }
]);

function getZoneOrganization(type: ZoneOrganizationsType): ZoneOrganization[] {
  return organizations.get(type) ?? DEFAULT_ZONE_ORGANIZATION;
}

export type { ZoneOrganizationsType, ZoneOrganization };
export { getZoneOrganization };