export function Dot(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
}
