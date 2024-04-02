import NavBar from "@/components/layout/NavBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      <main className="p-5">{children}</main>
    </div>
  );
}
