import type { Passkey } from "@better-auth/passkey";
import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowUpRightIcon,
	CalendarClockIcon,
	DownloadIcon,
	KeyRoundIcon,
	LogOutIcon,
	PlusIcon,
	SaveIcon,
	ShieldAlertIcon,
	Trash2Icon,
	UserIcon,
	WalletCardsIcon,
} from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { Spinner } from "#/components/ui/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { authClient } from "#/lib/auth-client";
import { useAddPasskey } from "#/queries/use-add-passkey";
import { useCustomerPortal } from "#/queries/use-customer-portal";
import {
	useDataExportRequest,
	useRequestDataExport,
} from "#/queries/use-data-export-request";
import { useDeletePasskey } from "#/queries/use-delete-passkey";
import { usePasskeys } from "#/queries/use-passkeys";
import { useProfileBilling } from "#/queries/use-profile-billing";
import { useRenamePasskey } from "#/queries/use-rename-passkey";

export const Route = createFileRoute("/_auth/profile")({
	head: () => ({
		meta: [
			{
				title: "Profile | Facteur",
			},
		],
	}),
	component: ProfilePage,
});

const dateFormatter = new Intl.DateTimeFormat("en", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

function ProfilePage() {
	const { data: session } = authClient.useSession();

	return (
		<div className="flex flex-1 bg-background">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:py-10">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex min-w-0 flex-col gap-2">
						<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
							<UserIcon aria-hidden="true" />
							Profile
						</div>
						<div className="flex min-w-0 flex-col gap-1">
							<h1 className="text-3xl font-semibold">Account settings</h1>
							<p className="max-w-2xl text-sm leading-6 text-muted-foreground">
								{session?.user.email ?? "Manage your Facteur account."}
							</p>
						</div>
					</div>
					<Badge variant="secondary">
						{session?.user.emailVerified ? "Verified email" : "Email pending"}
					</Badge>
				</div>

				<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
					<div className="flex min-w-0 flex-col gap-8">
						<BillingSection />
						<PasskeysSection />
					</div>
					<div className="flex min-w-0 flex-col gap-8">
						<DataExportSection />
						<AccountActionsSection />
					</div>
				</div>
			</div>
		</div>
	);
}

function BillingSection() {
	const billing = useProfileBilling();
	const portal = useCustomerPortal();

	const handlePortal = async () => {
		if (portal.isPending) {
			return;
		}

		try {
			const data = await portal.mutateAsync();
			window.location.assign(data.url);
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to open billing portal."));
		}
	};

	return (
		<ProfileSection
			title="Plan and usage"
			description="Current subscription, fixed limits, and metered credits."
			icon={<WalletCardsIcon aria-hidden="true" />}
			action={
				<Button
					type="button"
					variant="outline"
					disabled={portal.isPending}
					onClick={handlePortal}
				>
					{portal.isPending ? (
						<Spinner data-icon="inline-start" />
					) : (
						<ArrowUpRightIcon data-icon="inline-start" />
					)}
					Open portal
				</Button>
			}
		>
			{billing.isLoading ? (
				<div className="grid gap-3 sm:grid-cols-3">
					<Skeleton className="h-20" />
					<Skeleton className="h-20" />
					<Skeleton className="h-20" />
				</div>
			) : billing.error ? (
				<Alert variant="destructive">
					<ShieldAlertIcon />
					<AlertTitle>Billing is unavailable</AlertTitle>
					<AlertDescription>
						{getErrorMessage(billing.error, "Unable to load billing details.")}
					</AlertDescription>
				</Alert>
			) : billing.data ? (
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex min-w-0 flex-col gap-1">
							<span className="text-sm text-muted-foreground">Plan</span>
							<span className="truncate text-xl font-semibold">
								{billing.data.plan.name}
							</span>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant={getPlanStatusVariant(billing.data.plan.status)}>
								{formatStatus(billing.data.plan.status)}
							</Badge>
							{billing.data.plan.cancelAtPeriodEnd ? (
								<Badge variant="warning">Cancels at period end</Badge>
							) : null}
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-3">
						<UsageStat
							label="Mail credits"
							value={
								billing.data.limits.mailCredits
									? `${billing.data.limits.mailCredits.balance} left`
									: "Unavailable"
							}
							detail={
								billing.data.limits.mailCredits
									? `${billing.data.limits.mailCredits.consumed} used of ${billing.data.limits.mailCredits.credited}`
									: "Meter not found"
							}
						/>
						<UsageStat
							label="Domains"
							value={formatLimit(billing.data.limits.domains)}
							detail="Verified sender domains"
						/>
					</div>

					{billing.data.plan.currentPeriodEnd ? (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<CalendarClockIcon aria-hidden="true" />
							Current period ends{" "}
							{formatDate(billing.data.plan.currentPeriodEnd)}
						</div>
					) : null}
				</div>
			) : null}
		</ProfileSection>
	);
}

function PasskeysSection() {
	const passkeys = usePasskeys();
	const addPasskey = useAddPasskey();
	const [name, setName] = useState("");

	const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!supportsPasskeys()) {
			toast.error("This browser does not support passkeys.");
			return;
		}

		const trimmedName = name.trim();

		try {
			await addPasskey.mutateAsync(trimmedName || undefined);
			setName("");
			toast.success("Passkey added");
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to add passkey."));
		}
	};

	return (
		<ProfileSection
			title="Passkeys"
			description="Passwordless sign-in methods saved to this account."
			icon={<KeyRoundIcon aria-hidden="true" />}
		>
			<form onSubmit={handleAdd}>
				<FieldGroup>
					<Field data-disabled={addPasskey.isPending}>
						<FieldLabel htmlFor="passkey-name">New passkey name</FieldLabel>
						<div className="flex flex-col gap-2 sm:flex-row">
							<Input
								id="passkey-name"
								name="passkey-name"
								placeholder="Work laptop"
								disabled={addPasskey.isPending}
								value={name}
								onChange={(event) => setName(event.target.value)}
							/>
							<Button
								type="submit"
								disabled={addPasskey.isPending}
								className="sm:w-auto"
							>
								{addPasskey.isPending ? (
									<Spinner data-icon="inline-start" />
								) : (
									<PlusIcon data-icon="inline-start" />
								)}
								Add passkey
							</Button>
						</div>
						<FieldDescription>
							Your browser will ask you to confirm the new passkey.
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>

			<Separator />

			{passkeys.isLoading ? (
				<div className="flex flex-col gap-3">
					<Skeleton className="h-20" />
					<Skeleton className="h-20" />
				</div>
			) : passkeys.error ? (
				<Alert variant="destructive">
					<ShieldAlertIcon />
					<AlertTitle>Passkeys are unavailable</AlertTitle>
					<AlertDescription>
						{getErrorMessage(passkeys.error, "Unable to load passkeys.")}
					</AlertDescription>
				</Alert>
			) : passkeys.data?.length ? (
				<div className="flex flex-col gap-3">
					{passkeys.data.map((passkey) => (
						<PasskeyRow key={passkey.id} passkey={passkey} />
					))}
				</div>
			) : (
				<div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
					No passkeys saved yet.
				</div>
			)}
		</ProfileSection>
	);
}

function PasskeyRow({ passkey }: { passkey: Passkey }) {
	const renamePasskey = useRenamePasskey();
	const deletePasskey = useDeletePasskey();
	const [name, setName] = useState(passkey.name ?? "");
	const [deleteOpen, setDeleteOpen] = useState(false);
	const displayName = getPasskeyDisplayName(passkey);
	const trimmedName = name.trim();
	const savedName = passkey.name?.trim() ?? "";
	const renameDisabled =
		renamePasskey.isPending || !trimmedName || trimmedName === savedName;

	useEffect(() => {
		setName(passkey.name ?? "");
	}, [passkey.name]);

	const handleRename = async () => {
		if (!trimmedName) {
			toast.error("Enter a passkey name.");
			return;
		}

		try {
			await renamePasskey.mutateAsync({ id: passkey.id, name: trimmedName });
			toast.success("Passkey renamed");
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to rename passkey."));
		}
	};

	const handleDelete = async () => {
		try {
			await deletePasskey.mutateAsync(passkey.id);
			setDeleteOpen(false);
			toast.success("Passkey deleted");
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to delete passkey."));
		}
	};

	return (
		<div className="flex flex-col gap-4 rounded-lg border p-4">
			<div className="flex items-start justify-between gap-3">
				<div className="flex min-w-0 flex-col gap-1">
					<span className="truncate text-sm font-medium">{displayName}</span>
					<span className="text-sm text-muted-foreground">
						Created {formatDate(passkey.createdAt)}
					</span>
				</div>
				<Badge variant={passkey.backedUp ? "success" : "secondary"}>
					{passkey.backedUp ? "Synced" : "Device bound"}
				</Badge>
			</div>

			<Field data-disabled={renamePasskey.isPending}>
				<FieldLabel htmlFor={`passkey-${passkey.id}`}>Passkey name</FieldLabel>
				<div className="flex flex-col gap-2 sm:flex-row">
					<Input
						id={`passkey-${passkey.id}`}
						value={name}
						disabled={renamePasskey.isPending}
						onChange={(event) => setName(event.target.value)}
					/>
					<Button
						type="button"
						variant="outline"
						disabled={renameDisabled}
						onClick={handleRename}
					>
						{renamePasskey.isPending ? (
							<Spinner data-icon="inline-start" />
						) : (
							<SaveIcon data-icon="inline-start" />
						)}
						Save
					</Button>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									type="button"
									variant="ghost"
									size="icon"
									disabled={deletePasskey.isPending}
									aria-label="Delete passkey"
									onClick={() => setDeleteOpen(true)}
								/>
							}
						>
							<Trash2Icon />
						</TooltipTrigger>
						<TooltipContent>Delete passkey</TooltipContent>
					</Tooltip>
				</div>
			</Field>

			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this passkey?</AlertDialogTitle>
						<AlertDialogDescription>
							This removes {displayName} from your Facteur account. You can add
							a new passkey later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deletePasskey.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							type="button"
							variant="destructive"
							disabled={deletePasskey.isPending}
							onClick={handleDelete}
						>
							{deletePasskey.isPending ? (
								<Spinner data-icon="inline-start" />
							) : (
								<Trash2Icon data-icon="inline-start" />
							)}
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function DataExportSection() {
	const exportRequest = useDataExportRequest();
	const requestExport = useRequestDataExport();
	const pendingRequest = exportRequest.data;

	const handleRequestExport = async () => {
		try {
			await requestExport.mutateAsync();
			toast.success("Data export requested");
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to request data export."));
		}
	};

	return (
		<ProfileSection
			title="Data export"
			description="Request a copy of account data for GDPR access."
			icon={<DownloadIcon aria-hidden="true" />}
		>
			{exportRequest.isLoading ? (
				<Skeleton className="h-20" />
			) : exportRequest.error ? (
				<Alert variant="destructive">
					<ShieldAlertIcon />
					<AlertTitle>Export status is unavailable</AlertTitle>
					<AlertDescription>
						{getErrorMessage(
							exportRequest.error,
							"Unable to load export status.",
						)}
					</AlertDescription>
				</Alert>
			) : (
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4">
						<div className="flex min-w-0 flex-col gap-1">
							<span className="text-sm font-medium">
								{pendingRequest ? "Request pending" : "No active request"}
							</span>
							<span className="text-sm text-muted-foreground">
								{pendingRequest
									? `Requested ${formatDate(pendingRequest.createdAt)}`
									: "A future worker will prepare the export."}
							</span>
						</div>
						{pendingRequest ? <Badge variant="warning">Pending</Badge> : null}
					</div>
					<Button
						type="button"
						variant="outline"
						disabled={!!pendingRequest || requestExport.isPending}
						onClick={handleRequestExport}
					>
						{requestExport.isPending ? (
							<Spinner data-icon="inline-start" />
						) : (
							<DownloadIcon data-icon="inline-start" />
						)}
						Request export
					</Button>
				</div>
			)}
		</ProfileSection>
	);
}

function AccountActionsSection() {
	const [signOutPending, setSignOutPending] = useState(false);
	const [deletePending, setDeletePending] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const handleSignOut = async () => {
		setSignOutPending(true);
		try {
			const result = await authClient.signOut();
			if (result.error) {
				throw new Error(result.error.message ?? "Unable to log out.");
			}
			window.location.assign("/sign-in");
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to log out."));
		} finally {
			setSignOutPending(false);
		}
	};

	const handleDeleteAccount = async () => {
		setDeletePending(true);
		try {
			const result = await authClient.deleteUser({ callbackURL: "/sign-in" });
			if (result.error) {
				throw new Error(result.error.message ?? "Unable to delete account.");
			}
			window.location.assign("/sign-in");
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to delete account."));
		} finally {
			setDeletePending(false);
		}
	};

	return (
		<ProfileSection
			title="Account"
			description="Session controls and permanent account removal."
			icon={<ShieldAlertIcon aria-hidden="true" />}
		>
			<div className="flex flex-col gap-3">
				<Button
					type="button"
					variant="outline"
					disabled={signOutPending}
					onClick={handleSignOut}
				>
					{signOutPending ? (
						<Spinner data-icon="inline-start" />
					) : (
						<LogOutIcon data-icon="inline-start" />
					)}
					Log out
				</Button>
				<Button
					type="button"
					variant="destructive"
					disabled={deletePending}
					onClick={() => setDeleteOpen(true)}
				>
					<Trash2Icon data-icon="inline-start" />
					Delete account
				</Button>
			</div>

			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete your account?</AlertDialogTitle>
						<AlertDialogDescription>
							This permanently removes your Facteur account and saved domains.
							You will be signed out immediately.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deletePending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							type="button"
							variant="destructive"
							disabled={deletePending}
							onClick={handleDeleteAccount}
						>
							{deletePending ? (
								<Spinner data-icon="inline-start" />
							) : (
								<Trash2Icon data-icon="inline-start" />
							)}
							Delete account
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ProfileSection>
	);
}

function ProfileSection({
	title,
	description,
	icon,
	action,
	children,
}: {
	title: string;
	description: string;
	icon: ReactNode;
	action?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-5 rounded-lg border bg-background p-4 sm:p-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex min-w-0 gap-3">
					<span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
						{icon}
					</span>
					<div className="flex min-w-0 flex-col gap-1">
						<h2 className="text-base font-semibold">{title}</h2>
						<p className="text-sm leading-6 text-muted-foreground">
							{description}
						</p>
					</div>
				</div>
				{action ? <div className="flex shrink-0">{action}</div> : null}
			</div>
			{children}
		</section>
	);
}

function UsageStat({
	label,
	value,
	detail,
}: {
	label: string;
	value: string;
	detail: string;
}) {
	return (
		<div className="flex min-w-0 flex-col gap-1 rounded-lg border p-4">
			<span className="text-sm text-muted-foreground">{label}</span>
			<span className="truncate text-xl font-semibold">{value}</span>
			<span className="text-sm text-muted-foreground">{detail}</span>
		</div>
	);
}

function getPasskeyDisplayName(passkey: Passkey) {
	return passkey.name?.trim() || "Unnamed passkey";
}

function formatDate(value: Date | string | null | undefined) {
	if (!value) return "not available";
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "not available";
	return dateFormatter.format(date);
}

function formatLimit(limit: { current: number; max: number | null }) {
	return `${limit.current} / ${limit.max ?? "unlimited"}`;
}

function formatStatus(status: string) {
	if (status === "none") return "No subscription";
	return status
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function getPlanStatusVariant(status: string) {
	if (status === "active" || status === "trialing") return "success";
	if (status === "none") return "secondary";
	return "warning";
}

function getErrorMessage(error: unknown, fallback: string) {
	return error instanceof Error ? error.message : fallback;
}

function supportsPasskeys() {
	return typeof window !== "undefined" && "PublicKeyCredential" in window;
}
