import React from "react";

type Props = {
  variant?: "blue" | "red" | "purple" | "mix";
  intensity?: "soft" | "strong";
  children?: React.ReactNode;
};

export default function AccentWrapper({ variant = "mix", intensity = "soft", children }: Props){
  const className = `relative overflow-hidden ${intensity === "soft" ? "accent-soft" : "accent-strong"} section-gradient`;
  // si tu veux variant spécifique, tu peux regrouper classes css .section-gradient + .variant-{x} dans globals.css
  return <section className={className}>{children}</section>;
}