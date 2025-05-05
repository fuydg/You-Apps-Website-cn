Const $ = document.querySelector.bind(document);
const x = document.createElement.bind(document);

const contributorsUrl = "https://api.github.com/repos/fuydg/you-apps.github.io/contributors";

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
      console.error(`Failed to fetch data from ${url}: ${response.status} ${response.statusText}`);
      const teamDiv = $("#team > div");
      if (teamDiv) {
           teamDiv.innerHTML = `<p>无法加载贡献者列表。</p>`;
      }
      return null;
  }
  const json = await response.json();
  return json;
}

async function loadRepos() {
  const reposUrl = "https://api.github.com/orgs/you-apps/repos";
  const repos = await fetchJson(reposUrl);
   if (!repos) return;

  repos
    .filter(repo => repo.name.endsWith("You") && !repo.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .forEach(repo => {
      const a = x("a");
      a.className = "card";
      a.href = repo.html_url;

      const img = x("img");
      img.src = `https://raw.githubusercontent.com/you-apps/${repo.name}/main/fastlane/metadata/android/en-US/images/icon.png`;
      img.alt = `${repo.name} icon`;

      const div = x("div");
      const h3 = x("h3");
      h3.textContent = repo.name;
      const p = x("p");
      p.textContent = repo.description;
      div.append(h3, p);

      const span = x("span");
      span.className = "stars";
      const starIcon = x("img");
      starIcon.src = "assets/star.svg";
      starIcon.alt = "Star count";
      span.append(starIcon, document.createTextNode(repo.stargazers_count));

      a.append(img, div, span);
      const appsDiv = $("#apps > div");
       if (appsDiv) {
            appsDiv.appendChild(a);
       } else {
            console.error("#apps > div not found");
       }
    });
     const appsDiv = $("#apps > div");
     if (appsDiv && repos && repos.length > 0) {
          const noscript = appsDiv.querySelector('noscript');
          if(noscript) {
              noscript.remove();
          }
     }

}

async function loadContributors() {
  const teamDiv = $("#team > div");
  if (teamDiv) {
       teamDiv.innerHTML = '';
  } else {
       console.error("#team > div not found");
       return;
  }

  const contributors = await fetchJson(contributorsUrl);
  if (!contributors) return;

  contributors.sort((a, b) => b.contributions - a.contributions);

  for (const contributor of contributors) {
    const a = x("a");
    a.className = "card";
    a.href = contributor.html_url;
    a.target = "_blank";

    const img = x("img");
    img.src = contributor.avatar_url;
    img.alt = `${contributor.login} avatar`;

    const div = x("div");
    const h3 = x("h3");
    h3.textContent = contributor.login;

    const p = x("p");
    p.textContent = `贡献次数: ${contributor.contributions}`;
    p.className = "contributions";

    div.append(h3, p);

    a.append(img, div);

    teamDiv.appendChild(a);
  }
}

loadRepos();
loadContributors();
