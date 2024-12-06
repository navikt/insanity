const { writeFileSync, mkdirSync } = require("fs");

const cookie = process.env.SANITY_SESSION;
const orgId = "ojSsHMQGf";

const f = (url) =>
  fetch(`https://api.sanity.io${url}`, { headers: { cookie } }).then((res) =>
    res.json()
  );
const write = (path) => (data) =>
  writeFileSync(`data/${path}`, JSON.stringify(data, null, 2));

mkdirSync("data", { recursive: true });

Promise.all([
  f("/v2021-06-07/projects?includeOrganizationProjects=true")
    .then((json) => json.filter((project) => project.organizationId === orgId))
    .then((projects) =>
      Promise.all(
        projects.map((project) =>
          f(`/v2021-05-25/resources/snapshot/${project.id}`).then((json) => ({
            ...project,
            usage: json.usage,
          }))
        )
      )
    )
    .then(write("projects.json")),
  f(`/vX/access/organization/${orgId}/users?limit=500`)
    .then(({ data }) => data)
    .then(write("users.json")),
])
  .then(() => console.log("done"))
  .catch(console.error);
