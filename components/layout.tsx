import React from "react";

// Shared layout primitives so every page lines up to the same content width,
// horizontal padding and vertical rhythm.

export function Container({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

// Standard page with no hero — clears the fixed 64px nav and adds consistent
// bottom space, content constrained to the shared Container.
export function PageShell({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <main className="pb-24 pt-24 md:pt-28">
      <Container className={className}>{children}</Container>
    </main>
  );
}

// Vertical stack of page sections at the standard rhythm.
export function Sections({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`flex flex-col gap-12 md:gap-16 ${className}`}>
      {children}
    </div>
  );
}
