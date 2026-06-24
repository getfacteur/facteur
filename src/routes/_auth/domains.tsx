import { createFileRoute } from "@tanstack/react-router";
import { DomainTable } from "./-domains/components/domain-table";

export const Route = createFileRoute("/_auth/domains")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<DomainTable />
		</div>
	);
}
