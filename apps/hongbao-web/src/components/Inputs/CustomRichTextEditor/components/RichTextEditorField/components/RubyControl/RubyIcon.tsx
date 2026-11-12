type RubyIconProps = {
  size?: number;
};

const RubyIcon: React.FC<RubyIconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="3" y="2" width="10" height="2" rx="1" fill="currentColor" />
    <rect x="2" y="7" width="12" height="7" rx="1" fill="currentColor" fillOpacity="0.15" />
    <text
      x="8"
      y="12.5"
      textAnchor="middle"
      fontSize="7"
      fontWeight="700"
      fill="currentColor"
      fontFamily="sans-serif"
    >
      A
    </text>
  </svg>
);

export default RubyIcon;
