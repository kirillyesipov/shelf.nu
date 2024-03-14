import type { LoaderFunctionArgs } from "@remix-run/node";
import { assertUserCanExportAssets } from "~/modules/tier";
import { exportAssetsToCsv } from "~/utils/csv.server";
import { PermissionAction, PermissionEntity } from "~/utils/permissions";
import { requirePermission } from "~/utils/roles.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const authSession = context.getSession();

  const { organizationId, organizations } = await requirePermission({
    userId: authSession.userId,
    request,
    entity: PermissionEntity.asset,
    action: PermissionAction.export,
  });
  await assertUserCanExportAssets({ organizationId, organizations });

  /** Join the rows with a new line */
  const csvString = await exportAssetsToCsv({ organizationId });

  return new Response(csvString, {
    status: 200,
    headers: {
      "content-type": "text/csv",
    },
  });
};
