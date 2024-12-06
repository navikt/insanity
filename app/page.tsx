"use client";
import { Table } from "@navikt/ds-react";
import {
  SortState,
  TableBody,
  TableColumnHeader,
  TableDataCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@navikt/ds-react/Table";
import Link from "next/link";
import { useState } from "react";
import projects from "../data/projects.json";
import users from "../data/users.json";

const format = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${d}.${m}.${y}`;
};

interface ScopedSortState extends SortState {
  orderBy: keyof (typeof users)[0];
}

export default function Home() {
  const [sort, setSort] = useState<ScopedSortState | undefined>();

  const handleSort = (sortKey: ScopedSortState["orderBy"]) => {
    setSort(
      sort && sortKey === sort.orderBy && sort.direction === "descending"
        ? undefined
        : {
            orderBy: sortKey,
            direction:
              sort && sortKey === sort.orderBy && sort.direction === "ascending"
                ? "descending"
                : "ascending",
          }
    );
  };

  var get = (obj: any, path: string) => {
    for (var i = 0, p = path.split("."), len = p.length; i < len; i++) {
      obj = obj?.[p[i]];
    }
    return obj || null;
  };

  function comparator<T>(a: T, b: T, orderBy: string): number {
    const theA = get(a, orderBy);
    const theB = get(b, orderBy);
    let res;
    if (get(b, orderBy) == null || get(b, orderBy) < get(a, orderBy)) {
      res = -1;
    } else if (get(a, orderBy) == null || get(b, orderBy) > get(a, orderBy)) {
      res = 1;
    } else {
      res = 0;
    }
    return res;
  }

  const sortedData = users.toSorted((a, b) => {
    if (sort) {
      const s =
        sort.direction === "ascending"
          ? comparator(b, a, sort.orderBy)
          : comparator(a, b, sort.orderBy);
      return s;
    }
    return 0;
  });

  return (
    <>
      <h1>Projects ({projects.length})</h1>
      <h2>
        Active ({projects.filter((proj) => !proj.isDisabledByUser).length})
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell scope="col">displayName</TableHeaderCell>
            <TableHeaderCell scope="col">updatedAt</TableHeaderCell>
            <TableHeaderCell scope="col">members</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects
            .filter((proj) => !proj.isDisabledByUser)
            .map(({ id, displayName, updatedAt, members }, i) => {
              return (
                <TableRow key={id}>
                  <TableHeaderCell scope="row">
                    <Link href={`/projects/${id}`}>{displayName}</Link>
                  </TableHeaderCell>
                  <TableDataCell>{format(new Date(updatedAt))}</TableDataCell>
                  <TableDataCell>{members.length}</TableDataCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <h2>
        Archived ({projects.filter((proj) => proj.isDisabledByUser).length})
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell scope="col">displayName</TableHeaderCell>
            <TableHeaderCell scope="col">updatedAt</TableHeaderCell>
            <TableHeaderCell scope="col">members</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects
            .filter((proj) => proj.isDisabledByUser)
            .map(({ id, displayName, updatedAt, members }, i) => {
              return (
                <TableRow key={id}>
                  <TableHeaderCell scope="row">
                    <Link href={`/projects/${id}`}>{displayName}</Link>
                  </TableHeaderCell>
                  <TableDataCell>{format(new Date(updatedAt))}</TableDataCell>
                  <TableDataCell>{members.length}</TableDataCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <h1>Users ({users.length})</h1>
      <Table
        sort={sort}
        onSortChange={(sortKey) =>
          handleSort(sortKey as ScopedSortState["orderBy"])
        }
      >
        <TableHeader>
          <TableRow>
            <TableColumnHeader
              scope="col"
              sortKey="profile.displayName"
              sortable
            >
              displayName
            </TableColumnHeader>
            <TableColumnHeader scope="col" sortKey="resource.navIdent" sortable>
              navIdent
            </TableColumnHeader>
            <TableColumnHeader scope="col" sortKey="resource.endDate" sortable>
              endDate
            </TableColumnHeader>
            <TableColumnHeader scope="col" sortKey="profile.createdAt" sortable>
              createdAt
            </TableColumnHeader>
            <TableColumnHeader scope="col" sortKey="profile.updatedAt" sortable>
              updatedAt
            </TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map(
            ({
              profile: { id, displayName, createdAt, updatedAt },
              resource,
            }) => {
              return (
                <TableRow key={id}>
                  <TableHeaderCell scope="row">
                    <Link href={`/users/${id}`}>{displayName}</Link>
                  </TableHeaderCell>
                  <TableDataCell>{resource?.navIdent}</TableDataCell>
                  <TableDataCell>
                    {resource?.endDate && format(new Date(resource.endDate))}
                  </TableDataCell>
                  <TableDataCell>{format(new Date(createdAt))}</TableDataCell>
                  <TableDataCell>{format(new Date(updatedAt))}</TableDataCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </>
  );
}
