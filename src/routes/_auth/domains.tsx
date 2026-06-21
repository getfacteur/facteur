import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { useFixedUsage } from "#/queries/use-fixed-usage";
import { DomainDialog } from "./-domains/components/domain-dialog";
import { DomainTable } from "./-domains/components/domain-table";

export const Route = createFileRoute("/_auth/domains")({
	component: RouteComponent,
});

function RouteComponent() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { data } = useFixedUsage();

	return (
		<div>
			<DomainDialog open={dialogOpen} setOpen={setDialogOpen} />
			{(data?.current_domains ?? 0) < (data?.max_domains ?? 0) ? (
				<Button onClick={() => setDialogOpen(true)}>Open</Button>
			) : (
				<Tooltip>
					<TooltipTrigger render={<span />}>
						<Button disabled>Open</Button>
					</TooltipTrigger>
					<TooltipContent>
						maximum number of domains reached ({data?.max_domains}); upgrade
						your plan to unlock more
					</TooltipContent>
				</Tooltip>
			)}

			<DomainTable />
		</div>
	);
}
