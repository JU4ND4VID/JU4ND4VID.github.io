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
    description: "Proximamente",
    image: identity.logo,
  },
  subtitle: "Proyectos académicos y personales",
  projects: [
    {
      title: "FutbolTrack",
      description: "Proyecto académico desarrollado en el curso de Bases de Datos II, por Nicolas Matheus, Juan Moreno y Juan Peña.",
      image: "/logoProyecto.png",
      year: "2026",
      repoUrl: "https://github.com/JU4ND4VID/futboltrack",
      docsUrl: "https://unbosqueeduco-my.sharepoint.com/:f:/g/personal/nmatheus_unbosque_edu_co/IgD4ebN0j655SISehuYUb9WiAWudvwxR_Td3r3pwKmqkzc8?e=oHiZba",
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
  subtitle: " SQL | PL/SQL Scripts | NoSQL",
};
