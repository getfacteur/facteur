import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "#/components/data-table";
import { type Domain, useDomains } from "#/queries/use-domains";
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
	const { data } = useDomains();

	return (
		<div>
			<DataTable columns={columns} data={data ?? []} />
		</div>
	);
};
