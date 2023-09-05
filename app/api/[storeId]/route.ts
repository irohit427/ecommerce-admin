import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET (req: Request, { params }: {
  params: { storeId : string}
}) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store ID is Required', { status: 400 });
    }
    const store = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
      }
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_GET]: ', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}