import ViewShell, { Placeholder } from "./ViewShell";

// Milestone: "Profile view" in STATE.md
// Diet, allergies, cooking time and cycle phase form -> persistProfile(profile).
export default function ProfileView() {
  return (
    <ViewShell eyebrow="Your profile" title="Eat the way" accent="you want">
      <Placeholder>Profile not implemented yet.</Placeholder>
    </ViewShell>
  );
}
