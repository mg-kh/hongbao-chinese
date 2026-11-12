import { compact, includes, isEqual, split } from "lodash";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSidebarSections } from "./sidebarSections";
import {
  isLinkGroup,
  type NavItem,
  type NavLink,
  type NavLinkGroup,
} from "./types/sideBarMenu.type";

const flattenLinks = (items: NavItem[]): NavLink[] =>
  items.flatMap((item) => (isLinkGroup(item) ? item.links : [item]));

const useContainer = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { locale } = useParams();
  const segments = split(pathname, "/");
  const pathSegmentsAfterLocale = segments.slice(2);

  const isLinkActive = (link: NavLink) => {
    if (link.segment) {
      // match the segment only at the same depth it occupies in the
      // link's own href, so an unrelated nested route that happens to
      // reuse the same segment name (e.g. level-tests/[id]/quizzes vs
      // assets/quizzes) doesn't also light up this link
      const hrefSegments = compact(split(link.href, "/"));
      const segmentIndex = hrefSegments.indexOf(link.segment);
      if (segmentIndex === -1) return includes(segments, link.segment);
      return (
        pathSegmentsAfterLocale.length > segmentIndex &&
        isEqual(
          pathSegmentsAfterLocale.slice(0, segmentIndex + 1),
          hrefSegments.slice(0, segmentIndex + 1),
        )
      );
    }
    return pathname === `/${locale}${link.href}`;
  };

  const sections = getSidebarSections(t);

  const routeSectionId =
    sections.find(
      (section) =>
        flattenLinks(section.links).some(isLinkActive) ||
        (section.segment && includes(segments, section.segment)),
    )?.id ?? sections[0].id;

  const [activeId, setActiveId] = useState(routeSectionId);

  useEffect(() => {
    setActiveId(routeSectionId);
  }, [routeSectionId]);

  const activeSection =
    sections.find((section) => section.id === activeId) ?? sections[0];

  // cluster consecutive ungrouped links into one unlabeled block so they
  // render as a plain list instead of one wrapper per link
  const linkGroups = activeSection.links.reduce<NavLinkGroup[]>(
    (groups, item) => {
      if (isLinkGroup(item)) {
        groups.push(item);
        return groups;
      }
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && !lastGroup.group) {
        lastGroup.links.push(item);
      } else {
        groups.push({ group: "", links: [item] });
      }
      return groups;
    },
    [],
  );

  return {
    sections,
    activeId,
    setActiveId,
    activeSection,
    linkGroups,
    isLinkActive,
  };
};

export default useContainer;
