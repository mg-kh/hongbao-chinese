"use client";

import CopyableText from "@/app/[locale]/(dashboard)/dashboard/users/purchases/[purchaseId]/components/CopyableText/CopyableText";
import DetailSection from "@/app/[locale]/(dashboard)/dashboard/users/purchases/[purchaseId]/components/DetailSection/DetailSection";
import InfoRow from "@/app/[locale]/(dashboard)/dashboard/users/purchases/[purchaseId]/components/InfoRow/InfoRow";
import useContainer from "@/app/[locale]/(dashboard)/dashboard/users/purchases/[purchaseId]/components/PageComponent/useContainer";
import PurchaseItemRow from "@/app/[locale]/(dashboard)/dashboard/users/purchases/[purchaseId]/components/PurchaseItemRow/PurchaseItemRow";
import TransactionImage from "@/app/[locale]/(dashboard)/dashboard/users/purchases/[purchaseId]/components/TransactionImage/TransactionImage";
import PurchaseStatusBadge from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseStatusBadge/PurchaseStatusBadge";
import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { Avatar, Badge, Button, Divider, Paper, Text } from "@mantine/core";
import {
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  PackageIcon,
  UserIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

const PageComponent = () => {
  const {
    purchase,
    itemRows,
    totals,
    isLoading,
    isError,
    list,
    timeline,
    isPending,
    isBusy,
    handleApprove,
    handleReject,
  } = useContainer();

  const breadcrumb = (
    <CustomBreadCrumb
      title={purchase ? `Order ${purchase.orderNo}` : "Purchase detail"}
      links={[
        { label: "Dashboard", href: DASHBOARD, isActive: true },
        { label: list.label, href: list.href, isActive: true },
        { label: purchase?.orderNo ?? "Detail", href: "", isActive: false },
      ]}
    />
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-2.5">
        {breadcrumb}
        <LoaderComponent />
      </div>
    );
  }

  if (isError || !purchase || !totals) {
    return (
      <div className="flex flex-col gap-3 p-2.5">
        {breadcrumb}
        <Paper
          withBorder
          bdrs={16}
          className="flex! flex-col! items-center! border-dashed! border-gray-300! bg-gray-50/60! py-12!"
        >
          <Text size="sm" c="dimmed" fw={500}>
            Purchase not found
          </Text>
        </Paper>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-2.5">
      {breadcrumb}

      {/* ---------- header: order no · status ---------- */}
      <Paper withBorder bdrs={12} className="border-gray-200! px-4! py-3!">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <CopyableText value={purchase.orderNo} />
            <PurchaseStatusBadge status={purchase.status} />
          </div>
          <Text size="xs" c="gray.5">
            {timeline[0]?.at} · {timeline[0]?.ago}
          </Text>
        </div>
      </Paper>

      {/* ---------- reject reason ---------- */}
      {purchase.status === "CANCELLED" && (
        <Paper
          withBorder
          bdrs={12}
          className="flex! items-start! gap-2! border-red-200! bg-red-50/60! px-4! py-3!"
        >
          <XCircleIcon
            size={18}
            weight="fill"
            className="mt-0.5! shrink-0! text-red-500!"
          />
          <div className="min-w-0">
            <Text size="sm" fw={700} c="red.8">
              Rejected
            </Text>
            <Text
              size="sm"
              c="gray.7"
              className="whitespace-pre-line! break-words!"
            >
              {purchase.rejectReason || "No reason recorded."}
            </Text>
          </div>
        </Paper>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* ---------- left: items + timeline ---------- */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          <DetailSection
            title="Items"
            icon={<PackageIcon size={14} />}
            extra={
              <Badge size="sm" variant="light" color="gray" radius="sm">
                {itemRows.length}
              </Badge>
            }
          >
            <div className="flex flex-col divide-y divide-gray-100">
              {itemRows.map((row) => (
                <PurchaseItemRow key={row.item.id} {...row} />
              ))}
            </div>

            <Divider my={12} color="gray.1" />

            <div className="flex flex-col gap-1">
              {totals.hasDiscount && (
                <>
                  <div className="flex justify-between">
                    <Text size="sm" c="gray.6">
                      Subtotal
                    </Text>
                    <Text size="sm" fw={600} c="gray.7">
                      {totals.subtotal}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text size="sm" c="gray.6">
                      Discount
                    </Text>
                    <Text size="sm" fw={600} c="hongbao-red.6">
                      {totals.discount}
                    </Text>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <Text size="sm" fw={700} c="gray.8">
                  Total
                </Text>
                <Text size="sm" fw={800} c="hongbao-red.7">
                  {totals.total}
                </Text>
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Timeline" icon={<ClockIcon size={14} />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {timeline.map((step) => (
                <InfoRow key={step.label} label={step.label} hint={step.ago}>
                  {step.at}
                </InfoRow>
              ))}
            </div>
          </DetailSection>

          {/* ---------- approve / reject (pending only) ---------- */}
          {isPending && (
            <Paper
              withBorder
              bdrs={12}
              className="flex! items-center! justify-between! gap-3! border-gray-200! px-4! py-3!"
            >
              <div className="min-w-0">
                <Text size="10px" fw={700} c="gray.5" tt="uppercase">
                  Total
                </Text>
                <Text size="lg" fw={800} c="hongbao-red.7" lh={1.2}>
                  {totals.total}
                </Text>
              </div>
              <div className="flex shrink-0 items-center justify-end gap-2">
                <Button
                  size="sm"
                  color="red"
                  variant="outline"
                  disabled={isBusy}
                  onClick={handleReject}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  color="green"
                  leftSection={<CheckCircleIcon size={16} weight="fill" />}
                  loading={isBusy}
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              </div>
            </Paper>
          )}
        </div>

        {/* ---------- right: customer + payment ---------- */}
        <div className="flex flex-col gap-3">
          <DetailSection title="Customer" icon={<UserIcon size={14} />}>
            <div className="flex flex-col gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar
                  src={purchase.user?.imageUrl}
                  name={purchase.user?.name}
                  color="initials"
                  radius="xl"
                />
                <div className="min-w-0">
                  <Text size="sm" fw={600} c="gray.9" lineClamp={1}>
                    {purchase.user?.name || "-"}
                  </Text>
                  <Text size="xs" c="gray.5" className="break-all!">
                    {purchase.user?.email || "-"}
                  </Text>
                </div>
              </div>
              <InfoRow label="User ID">
                <CopyableText value={purchase.userId} />
              </InfoRow>
            </div>
          </DetailSection>

          <DetailSection title="Payment" icon={<CreditCardIcon size={14} />}>
            <div className="flex flex-col gap-3">
              <InfoRow label="Method">
                {purchase.paymentType?.toUpperCase() || "-"}
              </InfoRow>
              <InfoRow label="Transaction no">
                {purchase.transactionNo ? (
                  <CopyableText value={purchase.transactionNo} />
                ) : (
                  "-"
                )}
              </InfoRow>
              <InfoRow label="Transaction image">
                <TransactionImage />
              </InfoRow>
            </div>
          </DetailSection>
        </div>
      </div>
    </div>
  );
};

export default PageComponent;
