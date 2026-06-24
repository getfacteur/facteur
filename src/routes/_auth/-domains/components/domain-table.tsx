import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "#/components/data-table";
import { Skeleton } from "#/components/ui/skeleton";
import { type Domain, useDomains } from "#/queries/use-domains";
import { DomainDialog } from "./domain-dialog";
import { DomainStatusCell } from "./domain-status-cell";
import { DomainTableActions } from "./domain-table-actions";

const columnHelper = createColumnHelper<Domain>();

const columns = [
	columnHelper.accessor("domain", {
		cell: (info) => info.getValue(),
		header: "Domain",
	}),
	columnHelper.accessor("status", {
		cell: (props) => <DomainStatusCell domain={props.row.original} />,
		header: "Status",
	}),
	columnHelper.display({
		id: "actions",
		cell: (props) => <DomainTableActions domainId={props.row.original.id} />,
	}),
];

export const DomainTable = () => {
	const { data, isPending } = useDomains();

	if (isPending) {
		return (
			<output className="flex flex-col gap-3" aria-label="Loading domains">
				<Skeleton className="ml-auto h-8 w-20" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-24 w-full" />
			</output>
		);
	}

	return (
		<div>
			<DataTable
				columns={columns}
				data={data ?? []}
				addButton={<DomainDialog />}
				emptyMessage="No domains yet. Add one to start sending mail."
			/>
		</div>
	);
};
