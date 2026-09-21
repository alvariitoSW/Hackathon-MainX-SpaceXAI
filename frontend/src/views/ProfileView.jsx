import ViewShell, { Placeholder } from "./ViewShell";

// Hito: "Vista Perfil" en STATE.md
// Formulario de dieta, alergias, tiempo de cocina y fase hormonal -> updateProfile(profile).
export default function ProfileView() {
  return (
    <ViewShell eyebrow="Tu perfil" title="Comer como" accent="tú quieres">
      <Placeholder>Perfil pendiente de implementar.</Placeholder>
    </ViewShell>
  );
}
