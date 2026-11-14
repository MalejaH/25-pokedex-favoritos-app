import { Redirect } from "expo-router";
import { AuthForm } from "@/src/components/AuthForm";
import { Screen } from "@/src/components/Screen";
import { LoadingState } from "@/src/components/StateViews";
import { useSession } from "@/src/session/SessionProvider";

export default function LoginScreen() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <Screen>
        <LoadingState mensaje="Restaurando sesión…" />
      </Screen>
    );
  }
  if (session !== null) {
    return <Redirect href="/" />;
  }

  return (
    <Screen>
      <AuthForm />
    </Screen>
  );
}
