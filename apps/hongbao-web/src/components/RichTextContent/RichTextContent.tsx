import { createPortal } from "react-dom";
import AdsenseBanner from "@/components/AdsenseBanner/AdsenseBanner";
import useContainer from "./useContainer";

interface Props {
  html: string;
  className?: string;
}

/**
 * Renders HTML produced by CustomRichTextEditor for a public/published audience.
 * The editor's `advertisement` node is stored as an empty placeholder div, so
 * this replaces each one with the reusable `AdsenseBanner` component.
 */
const RichTextContent: React.FC<Props> = ({ html, className }) => {
  const { containerRef, advertisementSlots } = useContainer(html);

  return (
    <>
      <div ref={containerRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />
      {advertisementSlots.map((slot, index) => createPortal(<AdsenseBanner key={index} />, slot))}
    </>
  );
};

export default RichTextContent;
