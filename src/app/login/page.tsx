// path: src/app/login/page.tsx
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">Connexion</h1>
      <AuthForm mode="login" />
    </>
  );
}