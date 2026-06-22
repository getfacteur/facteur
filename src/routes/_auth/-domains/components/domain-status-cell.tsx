import {
	CircleAlertIcon,
	CircleCheckIcon,
	Clock3Icon,
	CopyIcon,
	InfoIcon,
	ListChecksIcon,
} from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { Spinner } from "#/components/ui/spinner";
import type { Domain } from "#/queries/use-domains";
import { useVerifyDomain } from "#/queries/use-verify-domain";

interface DomainStatusCellProps {
	domain: Domain;
}

interface DnsInstructionsDialogProps {
	domain: Pick<Domain, "domain" | "id" | "verificationToken">;
}

interface CopyableRecordValueProps {
	label: string;
	value: string;
}

const statusDetails = {
	pending: {
		icon: Clock3Icon,
		label: "Pending",
		variant: "warning",
	},
	verified: {
		icon: CircleCheckIcon,
		label: "Verified",
		variant: "success",
	},
	error: {
		icon: CircleAlertIcon,
		label: "Error",
		variant: "destructive",
	},
} as const;

const CopyableRecordValue: FC<CopyableRecordValueProps> = ({
	label,
	value,
}) => {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			toast.success(`${label} copied`);
		} catch {
			toast.error(`Could not copy ${label.toLowerCase()}`);
		}
	};

	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-xs font-medium text-muted-foreground">{label}</span>
			<div className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/50 p-2">
				<code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-xs">
					{value}
				</code>
				<Button
					aria-label={`Copy ${label.toLowerCase()}`}
					onClick={handleCopy}
					size="icon-xs"
					type="button"
					variant="ghost"
				>
					<CopyIcon data-icon="inline-start" />
				</Button>
			</div>
		</div>
	);
};

const DnsInstructionsDialog: FC<DnsInstructionsDialogProps> = ({ domain }) => {
	const [open, setOpen] = useState(false);
	const { mutateAsync: triggerVerifyDomain, isPending } = useVerifyDomain();
	const recordHost = "_facteur-relay";
	const recordValue = `facteur-relay-verification=${domain.verificationToken}`;
	const fullHostname = `${recordHost}.${domain.domain}`;

	const handleVerify = async () => {
		try {
			await triggerVerifyDomain({ domainId: domain.id });
			setOpen(false);
			toast.success("Verification started", {
				description: "Refresh the page shortly to see the latest status.",
			});
		} catch {
			toast.error("Could not start domain verification");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button size="xs" variant="outline" />}>
				<ListChecksIcon data-icon="inline-start" />
				View DNS setup
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Verify {domain.domain}</DialogTitle>
					<DialogDescription>
						Add this TXT record at your DNS provider, then start a new
						verification check.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<dl className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3">
						<div className="flex flex-col gap-1">
							<dt className="text-xs font-medium text-muted-foreground">
								Type
							</dt>
							<dd className="font-mono text-sm">TXT</dd>
						</div>
						<div className="flex flex-col gap-1">
							<dt className="text-xs font-medium text-muted-foreground">TTL</dt>
							<dd className="text-sm">Automatic or default</dd>
						</div>
					</dl>
					<CopyableRecordValue label="Name / Host" value={recordHost} />
					<CopyableRecordValue label="Value" value={recordValue} />
					<Alert>
						<InfoIcon />
						<AlertTitle>Provider expects a full hostname?</AlertTitle>
						<AlertDescription>
							Use <code>{fullHostname}</code> instead. DNS changes can take some
							time to propagate.
						</AlertDescription>
					</Alert>
				</div>

				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Close
					</DialogClose>
					<Button disabled={isPending} onClick={handleVerify} type="button">
						{isPending ? (
							<Spinner data-icon="inline-start" />
						) : (
							<ListChecksIcon data-icon="inline-start" />
						)}
						{isPending ? "Starting..." : "Verify now"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const DomainStatusCell: FC<DomainStatusCellProps> = ({ domain }) => {
	const details = statusDetails[domain.status];
	const StatusIcon = details.icon;

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Badge variant={details.variant}>
				<StatusIcon data-icon="inline-start" />
				{details.label}
			</Badge>
			{domain.status !== "verified" && (
				<DnsInstructionsDialog domain={domain} />
			)}
		</div>
	);
};
