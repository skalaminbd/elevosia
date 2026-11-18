export type ProfileDetails = {
  name: string;
  title: string;
  initials: string;
  photo?: string;
  role: string;
  experience: string;
  favorite: string;
  stack: string;
  tools: string;
  style: string;
  city: string;
  availability: string;
  badge: string;
  tags: string;
};

export type ProfileAddress = {
  street: string;
  city: string;
  region: string;
  postal: string;
  country: string;
};

export type Profile = {
  details: ProfileDetails;
  address: ProfileAddress;
};

export const adminProfile: Profile = {
  details: {
    name: "Alamin Rahman",
    title: "Workspace owner",
    initials: "AR",
    role: "Founder & delivery lead",
    experience: "12 years",
    favorite: "Home services, care, agencies",
    stack: "Next.js, Supabase, Stripe",
    tools: "Linear, Notion, Figma",
    style: "Async, deep work",
    city: "Dhaka, Bangladesh",
    availability: "Available for new projects",
    badge: "Top collaborator",
    tags: "#Delivery, #Design systems, #Client care",
  },
  address: {
    street: "House 12, Road 5, Dhanmondi",
    city: "Dhaka",
    region: "Dhaka Division",
    postal: "1205",
    country: "Bangladesh",
  },
};

export const clientProfile: Profile = {
  details: {
    name: "Sarah Whitfield",
    title: "Client owner",
    initials: "SW",
    role: "Owner, Brightline Care",
    experience: "8 years",
    favorite: "Home care, family services, wellness",
    stack: "Client portal, Google Calendar",
    tools: "Portal, email, phone",
    style: "Weekly check-ins",
    city: "San Diego, USA",
    availability: "Available for calls",
    badge: "Early adopter",
    tags: "#Care, #Growth, #Portal",
  },
  address: {
    street: "1440 Harbor Lane, Suite 210",
    city: "San Diego",
    region: "California",
    postal: "92101",
    country: "United States",
  },
};
