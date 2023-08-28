import prismadb from "@/lib/prismadb"

interface DashboardParams {
  params: {
    storeId: string
  }
}
const DashboardPage: React.FC<DashboardParams> = async ({
  params
}) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    }
  });

  return (
    <div>
      <p>Active store: {store?.name}</p>
    </div>
  )
}

export default DashboardPage;
