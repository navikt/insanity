import users from "../../../data/users.json";
import projects from "../../../data/projects.json";
import Link from "next/link";

export default async ({ params }: { params: Promise<{ userId: string }> }) => {
  const userId = (await params).userId;
  const user = users.find(({ profile }) => profile.id === userId)!;
  return (
    <div>
      <h1>{user.profile.displayName}</h1>
      <div>createdAt: {user.profile.createdAt}</div>
      <div>updatedAt: {user.profile.updatedAt}</div>
      {user.resource?.links?.ui && (
        <div>
          <Link href={user.resource.links.ui}>Teamkatalogen</Link>
        </div>
      )}
      <ul>
        {user.memberships.map((membership) => (
          <li key={membership.resourceId}>
            <Link href={`/projects/${membership.resourceId}`}>
              {
                projects.find(
                  (project) => project.id === membership.resourceId
                )!.displayName
              }
            </Link>
            : {membership.roleNames.join(", ")}
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
