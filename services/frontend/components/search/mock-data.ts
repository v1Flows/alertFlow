const searchData = {
  common: [
    {
      slug: "common-home",
      component: {
        name: "Home",
        slug: "common-home",
        icon: "solar:home-smile-outline",
        attributes: {
          group: "common",
          groupOrder: 1,
          iframe: {
            initialHeight: 220,
            initialMobileHeight: 220,
          },
        },
      },
      url: "/",
      group: {
        key: "dashboard",
        name: "Dashboard",
      },
      content: "Home",
    },
    {
      slug: "common-projects",
      component: {
        name: "Projects",
        slug: "common-projects",
        icon: "solar:inbox-archive-outline",
        attributes: {
          group: "common",
          groupOrder: 2,
          iframe: {
            initialHeight: 220,
            initialMobileHeight: 220,
          },
        },
      },
      url: "/projects",
      group: {
        key: "dashboard",
        name: "dashboard",
      },
      content: "Projects",
    },
    {
      slug: "common-flows",
      component: {
        name: "Flows",
        slug: "common-flows",
        icon: "solar:book-2-outline",
        attributes: {
          group: "common",
          groupOrder: 3,
          iframe: {
            initialHeight: 220,
            initialMobileHeight: 220,
          },
        },
      },
      url: "/flows",
      group: {
        key: "dashboard",
        name: "Dashboard",
      },
      content: "Flows",
    },
  ],
  user: [
    {
      slug: "profile-account",
      component: {
        name: "Account",
        slug: "profile-account",
        icon: "solar:emoji-funny-square-broken",
        attributes: {
          group: "profile",
          groupOrder: 1,
          iframe: {
            initialHeight: 220,
            initialMobileHeight: 220,
          },
        },
      },
      url: "/profile?tab=account",
      group: {
        key: "profile",
        name: "Profile",
      },
      content: "Account",
    },
    {
      slug: "profile-security",
      component: {
        name: "Security",
        slug: "profile-security",
        icon: "solar:shield-keyhole-bold",
        attributes: {
          group: "profile",
          groupOrder: 2,
          iframe: {
            initialHeight: 220,
            initialMobileHeight: 220,
          },
        },
      },
      url: "/profile?tab=security",
      group: {
        key: "profile",
        name: "Profile",
      },
      content: "Security",
    },
  ],
  projects: [],
  flows: [],
  help: [
    {
      slug: "help-api",
      component: {
        name: "API",
        slug: "help-api",
        icon: "solar:notebook-outline",
        attributes: {
          group: "informations",
          groupOrder: 2,
          iframe: {
            initialHeight: 220,
            initialMobileHeight: 220,
          },
        },
      },
      url: "/docs",
      group: {
        key: "informations",
        name: "Informations",
      },
      content: "API",
    },
  ],
};

export { searchData };
