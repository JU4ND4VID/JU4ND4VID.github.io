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
    title: "Inicio",
    url: "/",
  },
  {
    title: "Projectos",
    url: "/projects",
  },
  {
    title: "Evidencias",
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
  role: "Estudiante de Ingeniería de Sistemas",
  description:
    "Hola, soy Juan David y este soy yo 👇🏼.",
  socialLinks: socialLinks,
  links: [
    
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
  
  ],
};

// Blog (/blog)
export const blogPageContent: BlogPageContent = {
  seo: {
    title: "Consultas SQL Oracle | Juan David Peña",
    description: "Consultas",
    image: identity.logo,
  },
  subtitle: " SQL | PL/SQL Scripts | NoSQL",
};
