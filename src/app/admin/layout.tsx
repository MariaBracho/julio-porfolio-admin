import SideBar from "@/components/layout/SideBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideBar />
      <main className="p-5 w-full max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
