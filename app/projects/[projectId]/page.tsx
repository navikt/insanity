import { Table } from "@navikt/ds-react";
import {
  TableBody,
  TableDataCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@navikt/ds-react/Table";
import Link from "next/link";
import projects from "../../../data/projects.json";
import users from "../../../data/users.json";

export default async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const projectId = (await params).projectId;
  const project = projects.find(({ id }) => id === projectId)!;
  const members = users.filter((user) =>
    user.memberships.find((membership) => membership.resourceId === projectId)
  );

  return (
    <div>
      <h1>{project.displayName}</h1>
      <div>archived: {project.isDisabledByUser.toString()}</div>
      <div>datasets: {project.usage.datasets}</div>
      <div>createdAt: {project.createdAt}</div>
      <div>updatedAt: {project.updatedAt}</div>
      <div>features: {project.features.join(", ")}</div>
      <h2>Members ({members.length})</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell scope="col">displayName</TableHeaderCell>
            <TableHeaderCell scope="col">navIdent</TableHeaderCell>
            <TableHeaderCell scope="col">roleNames</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((user) => {
            const membership = user.memberships.find(
              (membership) => membership.resourceId === projectId
            );
            return (
              <TableRow key={user.profile.id}>
                <TableHeaderCell scope="row">
                  <Link href={`/users/${user.profile.id}`}>
                    {user.profile.displayName}
                  </Link>
                </TableHeaderCell>
                <TableDataCell>{user.resource?.navIdent}</TableDataCell>
                <TableDataCell>
                  {membership?.roleNames.join(", ")}
                </TableDataCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </div>
  );
};
