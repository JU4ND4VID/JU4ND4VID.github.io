import type {
  NavBarLink,
  SocialLink,
  Identity,
  AboutPageContent,
  ProjectPageContent,
  BlogPageContent,
  HomePageContent,
} from "./types/config";

export const identity: Identity = {
  name: "Juan David Peña",
  logo: "/avatar.png",
  email: "jdpenac@unbosque.edu.co",
};

export const navBarLinks: NavBarLink[] = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Projects",
    url: "/projects",
  },
  {
    title: "SQL",
    url: "/blog",
  },
];

export const socialLinks: SocialLink[] = [
  {
    title: "GitHub",
    url: "https://github.com/JU4ND4VID",
    icon: "mdi:github",
    external: true,
  },
  
];

// Home (/)
export const homePageContent: HomePageContent = {
  seo: {
    title: "Juan David Peña",
    description:
      "Full time student ",
    image: identity.logo,
  },
  role: "Systems Engineering student",
  description:
    "I'm Juan David.",
  socialLinks: socialLinks,
  links: [
    {
      title: "My Projects",
      url: "/projects",
    },
    {
      title: "About Me",
      url: "/about",
    },
  ],
};


// Projects (/projects)
export const projectsPageContent: ProjectPageContent = {
  seo: {
    title: "Projects | Juan David Peña",
    description: "Check out what I've been working on.",
    image: identity.logo,
  },
  subtitle: "Check out what I've been working on.",
  projects: [
    {
      title: "Project 1",
      description: "Project 1 Description",
      image: "/demo-2.jpg",
      year: "2024",
      url: "https://github.com/TimWitzdam",
    },
    {
      title: "Project 1",
      description: "Project 1 Description",
      image: "/demo-2.jpg",
      year: "2024",
      url: "https://github.com/TimWitzdam",
    },
    {
      title: "Project 1",
      description: "Project 1 Description",
      image: "/demo-2.jpg",
      year: "2024",
      url: "https://github.com/TimWitzdam",
    },
  ],
};

// Blog (/blog)
export const blogPageContent: BlogPageContent = {
  seo: {
    title: "Consultas SQL Oracle | Juan David Peña",
    description: "Consultas",
    image: identity.logo,
  },
  subtitle: "Thoughts, stories and ideas.",
};
