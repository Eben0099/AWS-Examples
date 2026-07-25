import { redirect } from "next/navigation";

export default function Home() {
  // Le proxy redirige déjà les visiteurs non authentifiés vers /login.
  redirect("/dashboard");
}
