// todo: schema로 변환하기
// todo: subdocuments
export type Image = {
  link: string | null;
  versions: {
    large: string | null;
    medium: string | null;
    small: string | null;
    micro: string | null;
  };
};

export type Skill = {
  id: number;
  name: string;
  level: number;
};

export type CursusUser = {
  grade: string | null;
  level: number;
  skills: Skill[];
  blackholed_at: string | null;
  id: number;
  begin_at: string;
  end_at: string | null;
  cursus_id: number;
  has_coalition: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    email: string;
    login: string;
    first_name: string;
    last_name: string;
    usual_full_name: string | null;
    usual_first_name: string | null;
    url: string;
    phone: string;
    displayname: string;
    kind: string;
    image: Image;
    'staff?': boolean;
    correction_point: number;
    pool_month: string;
    pool_year: string;
    location: string | null;
    wallet: number;
    anonymize_date: string;
    data_erasure_date: string;
    created_at: string;
    updated_at: string;
    alumnized_at: string | null;
    'alumni?': boolean;
    'active?': boolean;
  };
  cursus: {
    id: number;
    created_at: string;
    name: string;
    slug: string;
    kind: string;
  };
};

export type ProjectUser = {
  id: number;
  occurrence: number;
  final_mark: number | null;
  status: string;
  'validated?': boolean | null;
  current_team_id: number;
  project: {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
  };
  cursus_ids: number[];
  marked_at: string | null;
  marked: boolean;
  retriable_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LanguagesUser = {
  id: number;
  language_id: number;
  user_id: number;
  position: number;
  created_at: string;
};

export type Achievement = {
  id: number;
  name: string;
  description: string;
  tier: string;
  kind: string;
  visible: boolean;
  image: string | null;
  nbr_of_success: number | null;
  users_url: string;
};

export type Title = {
  id: number;
  name: string;
};

export type TitleUser = {
  id: number;
  user_id: number;
  title_id: number;
  selected: boolean;
  created_at: string;
  updated_at: string;
};

export type Campus = {
  id: number;
  name: string;
  time_zone: string;
  language: {
    id: number;
    name: string;
    identifier: string;
    created_at: string;
    updated_at: string;
  };
  users_count: number;
  vogsphere_id: number;
  country: string;
  address: string;
  zip: string;
  city: string;
  website: string;
  facebook: string;
  twitter: string;
  active: boolean;
  public: boolean;
  email_extension: string;
  default_hidden_phone: boolean;
};

export type CampusUser = {
  id: number;
  user_id: number;
  campus_id: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

export type DbUser = {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string | null;
  usual_first_name: string | null;
  url: string;
  phone: string;
  displayname: string;
  kind: string;
  image: Image;
  'staff?': boolean;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  location: string | null;
  wallet: number;
  anonymize_date: string;
  data_erasure_date: string;
  created_at: string;
  updated_at: string;
  alumnized_at: string | null;
  'alumni?': boolean;
  'active?': boolean;
  groups: [];
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
  languages_users: LanguagesUser[];
  achievements: Achievement[];
  titles: Title[];
  titles_users: TitleUser[];
  partnerships: [];
  patroned: [];
  patroning: [];
  expertises_users: [];
  roles: [];
  campus: Campus[];
  campus_users: CampusUser[];
};
