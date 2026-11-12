import { Button, ButtonProps, PolymorphicComponentProps } from "@mantine/core";

const RubyButtonComponent = <C = "button",>({
  children,
  ...buttonProps
}: PolymorphicComponentProps<C, ButtonProps>) => {
  return (
    <Button
      variant="gradient"
      gradient={{
        from: "hongbao-red.5",
        to: "hongbao-maroon.4",
        deg: 90,
      }}
      {...(buttonProps as ButtonProps)}
    >
      {children}
    </Button>
  );
};

export default RubyButtonComponent;
