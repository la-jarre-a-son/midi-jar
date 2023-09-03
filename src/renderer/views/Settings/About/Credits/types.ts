export type Credit = {
  name: string;
  description: string;
  links: {
    github?: string;
    website?: string;
  };
};

export type CreditItemProps = Credit;

export type CreditsProps = {
  items: Credit[];
};
