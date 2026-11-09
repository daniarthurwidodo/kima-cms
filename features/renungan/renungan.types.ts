export type Renungan = {
  id: string;
  publishDate: string;
  title: string;
  verse: string;
  scripture: string;
  description: string;
  imageUrl: string | null;
  imageAttribution: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RenunganInput = {
  publishDate: string;
  title: string;
  verse: string;
  scripture: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
};

export type RenunganImage = {
  imageUrl: string;
  imageAttribution: string | null;
};

export type RenunganResponse = {
  date: string;
  title: string;
  verse: string;
  scripture: string;
  description: string;
  imageUrl: string | null;
  imageAttribution: string | null;
};
