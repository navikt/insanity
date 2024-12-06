import { Table } from "@navikt/ds-react";
import {
  TableBody,
  TableDataCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@navikt/ds-react/Table";
import projects from "../data/projects.json";
import users from "../data/users.json";

const format = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${d}.${m}.${y}`;
};

export default function Home() {
  return (
    <>
      <h1>Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell scope="col">displayName</TableHeaderCell>
            <TableHeaderCell scope="col">navIdent</TableHeaderCell>
            <TableHeaderCell scope="col">endDate</TableHeaderCell>
            <TableHeaderCell scope="col">createdAt</TableHeaderCell>
            <TableHeaderCell scope="col">updatedAt</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(
            (
              { profile: { id, displayName, createdAt, updatedAt }, resource },
              i
            ) => {
              return (
                <TableRow key={id}>
                  <TableHeaderCell scope="row">{displayName}</TableHeaderCell>
                  <TableDataCell>{resource?.navIdent}</TableDataCell>
                  <TableDataCell>{resource?.endDate}</TableDataCell>
                  <TableDataCell>{format(new Date(createdAt))}</TableDataCell>
                  <TableDataCell>{format(new Date(updatedAt))}</TableDataCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
      <h1>Projects</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell scope="col">displayName</TableHeaderCell>
            <TableHeaderCell scope="col">updatedAt</TableHeaderCell>
            <TableHeaderCell scope="col">members</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(({ id, displayName, updatedAt, members }, i) => {
            return (
              <TableRow key={id}>
                <TableHeaderCell scope="row">{displayName}</TableHeaderCell>
                <TableDataCell>{format(new Date(updatedAt))}</TableDataCell>
                <TableDataCell>{members.length}</TableDataCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
