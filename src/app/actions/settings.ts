"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateAdSpend(formData: FormData) {
    const amount = formData.get("adSpend") as string;
    if (!amount) return;

    await db.settings.upsert({
        where: { key: "ad_spend" },
        update: { value: amount },
        create: { key: "ad_spend", value: amount },
    });

    revalidatePath("/dashboard");
}
