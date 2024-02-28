import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { ErrorContent } from "~/components/errors";
import Header from "~/components/layout/header";
import HorizontalTabs from "~/components/layout/horizontal-tabs";
import { useMatchesData } from "~/hooks";
import { useUserIsSelfService } from "~/hooks/user-user-is-self-service";
import { error } from "~/utils";

import { appendToMetaTitle } from "~/utils/append-to-meta-title";
import { makeShelfError } from "~/utils/error";

export const handle = {
  breadcrumb: () => <Link to="/settings">Settings</Link>,
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const title = "Settings";
    const subHeading = "Manage your preferences here.";
    const header = {
      title,
      subHeading,
    };
    return json({ header });
  } catch (cause) {
    const reason = makeShelfError(cause);
    throw json(error(reason));
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? appendToMetaTitle(data.header.title) : "" },
];

export const shouldRevalidate = () => false;

export default function SettingsPage() {
  let items = [
    { to: "account", content: "Account" },
    { to: "general", content: "General" },
    { to: "workspace", content: "Workspaces" },
    { to: "custom-fields", content: "Custom fields" },
    { to: "team", content: "Team" },
  ];

  const userIsSelfService = useUserIsSelfService();
  /** If user is self service, remove the extra items */
  if (userIsSelfService) {
    items = items.filter(
      (item) => !["custom-fields", "team", "general"].includes(item.to)
    );
  }

  const enablePremium = useMatchesData<{ enablePremium: boolean }>(
    "routes/_layout+/_layout"
  )?.enablePremium;

  if (enablePremium && !userIsSelfService) {
    items.push({ to: "subscription", content: "Subscription" });
  }

  return (
    <>
      <Header hidePageDescription />
      <HorizontalTabs items={items} />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export const ErrorBoundary = () => <ErrorContent />;
