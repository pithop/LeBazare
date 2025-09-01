// path: src/app/signup/page.tsx
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">Créer un compte</h1>
      <AuthForm mode="signup" />
    </>
  );
}